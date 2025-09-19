/* eslint-disable @typescript-eslint/no-explicit-any */

import { test } from '@fixtures/base.extend';
import { DimensionUnit, EntityStatus, WeightUnit } from '@codegen/admin-gql';
import { randomUUID } from 'node:crypto';
import { expect } from '@playwright/test';
import type { ApiFixtures } from '@fixtures/api/api';
import type { GraphQLFileName } from '@queries/filenames';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Загружает произвольное количество мок-файлов и возвращает их ID. */
async function uploadMockFiles(api: ApiFixtures['api'], count: number): Promise<string[]> {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(await api.admin.file.createFromURL(`https://example.com/${randomUUID()}/${i}.jpg`));
  }
  return ids;
}

/**
 * Cоздаёт товар-контейнер с указанным количеством вариантов.
 * Можно передать coverId и gallery, которые будут применены либо ко всем вариантам,
 * либо сгенерированы внутри фабрики.
 */
async function createProductWithVariants(
  api: ApiFixtures['api'],
  opts: {
    variantCount: number;
    // Если передано, используется для всех вариантов (case 1)
    uniformCoverId?: string;
    uniformGallery?: string[];
    // Если не передано, будет сгенерирован уникальный cover + gallery на каждый вариант (case 2)
  },
) {
  const handle = `product-gallery-${randomUUID()}`;
  const variants: any[] = [];

  for (let i = 0; i < opts.variantCount; i++) {
    let coverId: string;
    let gallery: string[];

    if (opts.uniformCoverId && opts.uniformGallery) {
      coverId = opts.uniformCoverId;
      gallery = opts.uniformGallery;
    } else {
      // генерируем свои файлы
      const [c, ...g] = await uploadMockFiles(api, 4); // 1 cover + 3 gallery
      coverId = c;
      gallery = g;
    }

    variants.push({
      title: `Variant ${i + 1}`,
      price: 0,
      stockStatus: 'IN_STOCK',
      slug: `${randomUUID()}`,
      inListing: true,
      weight: 0,
      weightUnit: WeightUnit.Gr,
      width: 0,
      height: 0,
      length: 0,
      dimensionUnit: DimensionUnit.Mm,
      categories: [],
      variantSortIndex: i,
      coverId,
      gallery,
    });
  }

  const product = await api.admin.product.create({
    input: {
      title: 'Gallery Test Product',
      slug: handle,
      status: EntityStatus.Published,
      requiresShipping: false,
      groups: [],
      tags: [],
      variants: {
        create: variants,
      },
    },
  });

  return { product, handle } as const;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('product gallery connection', () => {
  test('all variants inherit same cover & gallery from container', async ({ api }) => {
    await api.session.setupUserAndProject();

    // Подготовка файлов: один cover + 3 gallery
    const [coverId, ...galleryIds] = await uploadMockFiles(api, 4);

    const { product } = await createProductWithVariants(api, {
      variantCount: 3,
      uniformCoverId: coverId,
      uniformGallery: galleryIds,
    });

    await api.session.setupApiKey();

    for (const variant of product.variants) {
      // Проверяем cover через обычный Product query
      const { data: prodData } = await api.client.query('client/Product', {
        variables: { handle: variant.slug },
      });
      expect((prodData as any).product.cover?.id).toBe(coverId);

      // Проверяем gallery
      const { data: galData } = await api.client.query('client/ProductGallery', {
        variables: { handle: variant.slug, first: 10 },
      });
      const returned = (galData as any).product.gallery.edges.map((e: any) => e.node.iid);
      expect(returned).toEqual(galleryIds);
    }
  });

  test('variants retain individual cover & gallery', async ({ api }) => {
    await api.session.setupUserAndProject();
    const { product } = await createProductWithVariants(api, { variantCount: 3 });
    await api.session.setupApiKey();

    // Собираем coverIds и galleryIds по каждому варианту для проверки уникальности
    const coverIds: string[] = [];
    const galleries: string[][] = [];

    for (const variant of product.variants) {
      const { data: prodData } = await api.client.query('client/Product', {
        variables: { handle: variant.slug },
      });
      coverIds.push((prodData as any).product.cover?.id);

      const { data: galData } = await api.client.query('client/ProductGallery', {
        variables: { handle: variant.slug, first: 10 },
      });
      galleries.push((galData as any).product.gallery.edges.map((e: any) => e.node.iid));
    }

    // Проверяем что все coverId разные
    expect(new Set(coverIds).size).toBe(coverIds.length);
    // И галереи разные (сравниваем по строковому представлению)
    expect(new Set(galleries.map((g) => g.join(','))).size).toBe(galleries.length);
  });

  test('paginates single product gallery with cursors', async ({ api }) => {
    await api.session.setupUserAndProject();

    // Создаём один продукт-контейнер с 1 вариантом для простоты
    const [coverId, ...galleryIds] = await uploadMockFiles(api, 6); // 1 cover + 5 gallery
    const { product } = await createProductWithVariants(api, {
      variantCount: 1,
      uniformCoverId: coverId,
      uniformGallery: galleryIds,
    });

    const variant = product.variants[0];

    await api.session.setupApiKey();

    // First two files
    const firstResp = await api.client.query('client/ProductGallery', {
      variables: { handle: variant.slug, first: 2 },
    });

    const firstEdges = (firstResp.data as any).product.gallery.edges;
    expect(firstEdges).toHaveLength(2);
    const pageInfo = (firstResp.data as any).product.gallery.pageInfo;
    const endCursor = pageInfo.endCursor as string;
    expect(pageInfo.hasNextPage).toBe(true);

    // Next page after cursor
    const secondResp = await api.client.query('client/ProductGallery', {
      variables: { handle: variant.slug, first: 10, after: endCursor },
    });
    const secondEdges = (secondResp.data as any).product.gallery.edges;
    expect(secondEdges.length).toBe(galleryIds.length - 2);
    expect((secondResp.data as any).product.gallery.pageInfo.hasNextPage).toBe(false);
  });

  test('independent cursors per alias (3 products)', async ({ api }) => {
    await api.session.setupUserAndProject();

    const products = [] as { variant: any; titles: string[] }[];
    for (let i = 0; i < 3; i++) {
      const [coverId, ...galleryIds] = await uploadMockFiles(api, 5); // 1 cover + 4 gallery
      const { product } = await createProductWithVariants(api, {
        variantCount: 1,
        uniformCoverId: coverId,
        uniformGallery: galleryIds,
      });
      products.push({ variant: product.variants[0], titles: galleryIds });
    }

    await api.session.setupApiKey();

    const PAGE_SIZE = 2;

    // --------- First request ---------
    const { data: first } = await api.client.query('client/ProductGalleryAliases', {
      variables: {
        handle1: products[0].variant.slug,
        handle2: products[1].variant.slug,
        handle3: products[2].variant.slug,
        first1: PAGE_SIZE, // prod1 forward
        last2: PAGE_SIZE, // prod2 backward (last page)
        first3: PAGE_SIZE, // prod3 forward but static
      } as any,
    });

    const prod1Page1 = (first as any).prod1.gallery;
    const prod2Page1 = (first as any).prod2.gallery;
    const prod3Page1 = (first as any).prod3.gallery;

    const expectIids = (edges: any[], expected: string[]) => {
      expect(edges.map((e: any) => e.node.iid)).toEqual(expected);
    };

    expectIids(prod1Page1.edges, products[0].titles.slice(0, PAGE_SIZE));
    expectIids(prod2Page1.edges, products[1].titles.slice(-PAGE_SIZE));
    expectIids(prod3Page1.edges, products[2].titles.slice(0, PAGE_SIZE));

    const after1 = prod1Page1.pageInfo.endCursor as string;
    const before2 = prod2Page1.pageInfo.startCursor as string;

    // --------- Second request ---------
    const { data: second } = await api.client.query(
      'client/ProductGalleryAliases' as unknown as GraphQLFileName,
      {
        variables: {
          handle1: products[0].variant.slug,
          handle2: products[1].variant.slug,
          handle3: products[2].variant.slug,
          first1: PAGE_SIZE, // next slice for prod1
          after1,
          last2: PAGE_SIZE, // previous slice for prod2
          before2,
          first3: PAGE_SIZE, // prod3 again first page
        } as any,
      },
    );

    const prod1Page2 = (second as any).prod1.gallery;
    const prod2Prev = (second as any).prod2.gallery;
    const prod3Same = (second as any).prod3.gallery;

    expectIids(prod1Page2.edges, products[0].titles.slice(PAGE_SIZE, PAGE_SIZE * 2));
    expectIids(prod2Prev.edges, products[1].titles.slice(-PAGE_SIZE * 2, -PAGE_SIZE));
    expectIids(prod3Same.edges, products[2].titles.slice(0, PAGE_SIZE));
  });
});
