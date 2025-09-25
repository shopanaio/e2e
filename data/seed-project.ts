/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiProduct,
  DimensionUnit,
  EntityStatus,
  ListingSort,
  ListingType,
  ReviewStatus,
  WeightUnit,
} from '@codegen/admin-gql';
import { TenantApiFixture } from '@fixtures/admin/api';
import { CATEGORIES, TAGS, PRODUCTS, REVIEW_TEMPLATES } from './seed-config';

export async function seedCategories(api: TenantApiFixture): Promise<Record<string, string>> {
  const categoryMap: Record<string, string> = {};

  for (const categoryData of CATEGORIES) {
    try {
      const category = await api.category.create({
        input: {
          title: categoryData.title,
          slug: categoryData.slug,
          description: {
            html: `<p>${categoryData.description}</p>`,
            json: JSON.stringify({ content: categoryData.description }),
            text: categoryData.description,
          },
          status: EntityStatus.Published,
          listingType: ListingType.Manual,
          includeChildrenProducts: false,
          listingOrderByStatus: false,
          listingFilters: [],
          listingOrderBy: ListingSort.Custom,
        },
      });

      categoryMap[categoryData.slug] = category.id;
    } catch (error: any) {
      console.log(`Failed to create category ${categoryData.slug}, continuing...`, error);
      continue;
    }

    if (categoryData.children && categoryMap[categoryData.slug]) {
      for (const childTitle of categoryData.children) {
        const childSlug = `${categoryData.slug}-${childTitle.toLowerCase().replace(/\s+/g, '-')}`;
        try {
          const childCategory = await api.category.create({
            input: {
              title: childTitle,
              slug: childSlug,
              parentId: categoryMap[categoryData.slug],
              status: EntityStatus.Published,
              listingType: ListingType.Manual,
              includeChildrenProducts: false,
              listingOrderByStatus: false,
              listingFilters: [],
              listingOrderBy: ListingSort.Custom,
            },
          });

          categoryMap[childSlug] = childCategory.id;
        } catch (error: any) {
          console.log(`Failed to create child category ${childSlug}, continuing...`, error);
          continue;
        }
      }
    }
  }

  return categoryMap;
}

export async function seedTags(api: TenantApiFixture): Promise<Record<string, string>> {
  const tagMap: Record<string, string> = {};

  for (const tagData of TAGS) {
    try {
      const tag = await api.tag.create({
        input: {
          title: tagData.title,
          slug: tagData.slug,
        },
      });

      tagMap[tagData.slug] = tag.id;
    } catch (error: any) {
      console.log(`Failed to create tag ${tagData.slug}, continuing...`, error);
      continue;
    }
  }

  return tagMap;
}

export async function seedProducts(
  api: TenantApiFixture,
  categoryMap: Record<string, string>,
  tagMap: Record<string, string>,
): Promise<Record<string, ApiProduct>> {
  const productMap: Record<string, ApiProduct> = {};

  for (const productData of PRODUCTS) {
    const tagIds = (productData.tags ?? []).map((tagSlug) => tagMap[tagSlug]).filter(Boolean);
    const basePriceCents = Math.round((productData.price || 0) * 100);

    let product: ApiProduct;

    try {
      if (productData.featureGroups && productData.featureGroups.length > 0) {
        // Продукт с опциями - используем новый API
        const options = productData.featureGroups.map((fg) => ({
          title: fg.slug.charAt(0).toUpperCase() + fg.slug.slice(1), // capitalize first letter
          slug: fg.slug,
          values: fg.values,
        }));

        product = await api.product.createWithOptions({
          title: productData.title,
          slug: productData.slug,
          status: EntityStatus.Published,
          price: basePriceCents,
          options: options,
        });
      } else {
        // Простой продукт без опций
        product = await api.product.create({
          input: {
            title: productData.title,
            slug: productData.slug,
            status: EntityStatus.Published,
            requiresShipping: true,
            description: {
              html: `<p>${productData.description}</p>`,
              json: JSON.stringify({
                data: {
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      attrs: {
                        nodeIndent: null,
                        nodeTextAlignment: null,
                        nodeLineHeight: null,
                        style: '',
                      },
                      content: [
                        {
                          type: 'text',
                          text: productData.description,
                        },
                      ],
                    },
                  ],
                },
              }),
              text: productData.description,
            },

            excerpt: '',
            groups: [],
            tags: tagIds,
            variants: {
              create: [
                {
                  title: productData.title,
                  slug: productData.slug,
                  price: basePriceCents,
                  oldPrice: 0,
                  costPrice: 0,
                  sku: productData.slug,
                  stockStatus: 'IN_STOCK',
                  categories: [],
                  inListing: true,
                  variantSortIndex: 0,
                  weight: 0,
                  weightUnit: WeightUnit.Gr,
                  width: 0,
                  height: 0,
                  length: 0,
                  dimensionUnit: DimensionUnit.Cm,
                  gallery: [],
                  coverId: null,
                },
              ],
            },
          },
        });
      }

      productMap[product.slug] = product;
    } catch (error: any) {
      console.log(`Failed to create product ${productData.slug}, continuing...`, error);
      continue;
    }
  }

  for (const productData of PRODUCTS) {
    if (!productData.groups || productData.groups.length === 0) {
      continue;
    }

    const mainProduct = productMap[productData.slug];
    if (!mainProduct) {
      continue;
    }

    const groupsToCreate = productData.groups.map((group) => {
      const items = group.items
        .map((item) => {
          const componentProduct = productMap[item.productSlug];
          if (!componentProduct) {
            return null;
          }

          let variant;

          const itemWithFeatures = item as any;
          if (itemWithFeatures.featureValues && itemWithFeatures.featureValues.length > 0) {
            // Найти вариант по заголовку, который содержит все значения фич
            const targetTitle = itemWithFeatures.featureValues.join(' ');
            variant = componentProduct.variants.find(
              (v) =>
                v.title.includes(targetTitle) ||
                itemWithFeatures.featureValues.every((value: string) => v.title.includes(value)),
            );

            if (!variant) {
              return null;
            }
          } else {
            const variantSlug = itemWithFeatures.variantSlug ?? item.productSlug;
            variant = componentProduct.variants.find((v) => v.slug === variantSlug);

            if (!variant) {
              return null;
            }
          }

          return {
            variantId: variant.id,
            sortIndex: item.sortIndex,
            priceType: item.priceType,
            priceAmountValue: item.priceAmountValue,
            pricePercentageValue: item.pricePercentageValue,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return {
        ...group,
        items,
      };
    });

    if (groupsToCreate.some((g) => g.items.length > 0)) {
      await api.product.update({
        input: {
          id: mainProduct.id,
          groups: {
            create: groupsToCreate,
          },
        },
      });
    }
  }

  return productMap;
}

export async function seedCustomers(api: TenantApiFixture): Promise<string[]> {
  const customerIds: string[] = [];

  const customers = [
    { firstName: 'Иван', lastName: 'Петров', email: 'ivan.petrov@example.com' },
    { firstName: 'Мария', lastName: 'Сидорова', email: 'maria.sidorova@example.com' },
    { firstName: 'Алексей', lastName: 'Козлов', email: 'alex.kozlov@example.com' },
    { firstName: 'Елена', lastName: 'Новикова', email: 'elena.novikova@example.com' },
    { firstName: 'Дмитрий', lastName: 'Смирнов', email: 'dmitry.smirnov@example.com' },
    { firstName: 'Ольга', lastName: 'Иванова', email: 'olga.ivanova@example.com' },
    { firstName: 'Андрей', lastName: 'Кузнецов', email: 'andrey.kuznetsov@example.com' },
    { firstName: 'Татьяна', lastName: 'Васильева', email: 'tatiana.vasileva@example.com' },
    { firstName: 'Сергей', lastName: 'Михайлов', email: 'sergey.mihajlov@example.com' },
    { firstName: 'Екатерина', lastName: 'Попова', email: 'ekaterina.popova@example.com' },
    { firstName: 'Павел', lastName: 'Федоров', email: 'pavel.fedorov@example.com' },
    { firstName: 'Наталья', lastName: 'Николаева', email: 'natalya.nikolaeva@example.com' },
    { firstName: 'Владимир', lastName: 'Смирнов', email: 'vladimir.smirnov@example.com' },
    { firstName: 'Евгения', lastName: 'Кузнецова', email: 'evgenia.kuznetsova@example.com' },
    { firstName: 'Дмитрий', lastName: 'Васильев', email: 'dmitry.vasilev@example.com' },
  ];

  for (const customerData of customers) {
    try {
      const customer = await api.customer.create({
        ...customerData,
        password: 'Test123!',
        isVerified: true,
        language: 'ru',
      });

      customerIds.push(customer.id);
    } catch (error: any) {
      console.log(`Failed to create customer ${customerData.email}, continuing...`, error);
      continue;
    }
  }

  return customerIds;
}

export async function seedReviews(
  adminApi: TenantApiFixture,
  productIds: string[],
  customerIds: string[],
): Promise<void> {
  const reviewerNames = [
    'Александр К.',
    'Ольга М.',
    'Сергей П.',
    'Наталья В.',
    'Виктор Д.',
    'Елена С.',
    'Дмитрий В.',
    'Мария С.',
    'Алексей К.',
    'Елена Н.',
    'Дмитрий С.',
    'Ольга И.',
    'Андрей К.',
    'Татьяна В.',
    'Сергей М.',
  ];

  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const product = await adminApi.product.findOne(productId);

    const variantId = product.variants[0]?.id;
    if (!variantId) {
      continue;
    }

    const reviewCount = REVIEW_TEMPLATES.length;

    for (let j = 0; j < reviewCount; j++) {
      const customerId = customerIds[j];
      const reviewerName = reviewerNames[j];
      const reviewTemplate = REVIEW_TEMPLATES[j];

      try {
        const id = await adminApi.review.create({
          productId: variantId,
          customerId: customerId,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          message: reviewTemplate.message,
          pros: reviewTemplate.pros,
          cons: reviewTemplate.cons,
          locale: 'ru',
          displayName: reviewerName,
        });

        await adminApi.review.update({
          input: {
            id,
            productId: variantId,
            customerId: customerId,
            displayName: reviewerName,
            status: ReviewStatus.Approved,
          },
        });
        } catch (error: any) {
          console.log(`Failed to create review for product ${variantId} from ${reviewerName}, continuing...`, error);
          continue;
        }
    }
  }
}

export async function seedProject(adminApi: TenantApiFixture): Promise<void> {
  let categoryMap: Record<string, string> = {};
  let tagMap: Record<string, string> = {};
  let productMap: Record<string, ApiProduct> = {};
  let productIds: string[] = [];
  let customerIds: string[] = [];

  try {
    categoryMap = await seedCategories(adminApi);
  } catch (error) {
    console.log('Error seeding categories, continuing...', error);
  }

  try {
    tagMap = await seedTags(adminApi);
  } catch (error) {
    console.log('Error seeding tags, continuing...', error);
  }

  try {
    productMap = await seedProducts(adminApi, categoryMap, tagMap);
    productIds = Object.values(productMap).map((p) => p.id);
  } catch (error) {
    console.log('Error seeding products, continuing...', error);
  }

  try {
    customerIds = await seedCustomers(adminApi);
  } catch (error) {
    console.log('Error seeding customers, continuing...', error);
  }

  try {
    await seedReviews(adminApi, productIds, customerIds);
  } catch (error) {
    console.log('Error seeding reviews, continuing...', error);
  }
}
