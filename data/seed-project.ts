/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiFeatureGroup,
  ApiProduct,
  DimensionUnit,
  EntityStatus,
  FeatureStyleType,
  ListingSort,
  ListingType,
  ReviewStatus,
  WeightUnit,
} from '@codegen/admin-gql';
import { TenantApiFixture } from '@fixtures/admin/api';
import { CATEGORIES, TAGS, FEATURE_GROUPS, PRODUCTS, REVIEW_TEMPLATES } from './seed-config';

// Функция генерации slug'а варианта из названий фич
function generateVariantSlug(productSlug: string, featureValues: string[]): string {
  return `${productSlug}_${featureValues
    .map((val) => val.toLowerCase())
    .join('_')}`;
}

// Функция создания категорий
export async function seedCategories(api: TenantApiFixture): Promise<Record<string, string>> {
  const categoryMap: Record<string, string> = {};

  console.log('🏷️  Создание категорий...');

  for (const categoryData of CATEGORIES) {
    // Создаем родительскую категорию
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
    console.log(`   ✅ Создана категория: ${categoryData.title}`);

    // Создаем дочерние категории
    if (categoryData.children) {
      for (const childTitle of categoryData.children) {
        const childSlug = `${categoryData.slug}-${childTitle.toLowerCase().replace(/\s+/g, '-')}`;
        const childCategory = await api.category.create({
          input: {
            title: childTitle,
            slug: childSlug,
            parentId: category.id,
            status: EntityStatus.Published,
            listingType: ListingType.Manual,
            includeChildrenProducts: false,
            listingOrderByStatus: false,
            listingFilters: [],
            listingOrderBy: ListingSort.Custom,
          },
        });

        categoryMap[childSlug] = childCategory.id;
        console.log(`      ✅ Создана подкатегория: ${childTitle}`);
      }
    }
  }

  return categoryMap;
}

// Функция создания тегов
export async function seedTags(api: TenantApiFixture): Promise<Record<string, string>> {
  const tagMap: Record<string, string> = {};

  console.log('\n🏷️  Создание тегов...');

  for (const tagData of TAGS) {
    const tag = await api.tag.create({
      input: {
        title: tagData.title,
        slug: tagData.slug,
      },
    });

    tagMap[tagData.slug] = tag.id;
    console.log(`   ✅ Создан тег: ${tagData.title}`);
  }

  return tagMap;
}

// Функция создания feature groups
export async function seedFeatureGroups(
  api: TenantApiFixture,
): Promise<Record<string, ApiFeatureGroup>> {
  const featureGroupMap: Record<string, ApiFeatureGroup> = {};

  console.log('\n🎨 Создание опций (feature groups)...');

  for (const featureGroupData of FEATURE_GROUPS) {
    const featureGroup = await api.feature.createGroupWithValues({
      title: featureGroupData.title,
      slug: featureGroupData.slug,
      values: featureGroupData.values,
    });

    featureGroupMap[featureGroupData.slug] = featureGroup;
    console.log(
      `   ✅ Создана группа опций: ${featureGroupData.title} (${featureGroupData.values.length} значений)`,
    );
  }

  return featureGroupMap;
}

// Функция создания продуктов
export async function seedProducts(
  api: TenantApiFixture,
  categoryMap: Record<string, string>,
  tagMap: Record<string, string>,
  featureGroupMap: Record<string, ApiFeatureGroup>,
): Promise<Record<string, ApiProduct>> {
  const productMap: Record<string, ApiProduct> = {};

  console.log('\n📦 Создание продуктов...');

  for (const productData of PRODUCTS) {
    const categoryId = categoryMap[productData.category];
    const categoriesForVariant = categoryId ? [categoryId] : [];

    // Безопасное определение базовой цены
    const rawPrice = productData.price ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Array.isArray((productData as any).variants) && (productData as any).variants[0]?.price?.amount
        ? parseFloat((productData as any).variants[0].price.amount)
        : 0);
    const basePriceCents = Math.round((rawPrice || 0) * 100);

    const tagIds = (productData.tags ?? []).map((tagSlug) => tagMap[tagSlug]).filter(Boolean);

    // Генерируем варианты на основе существующих feature groups
    const variantsToCreate = [];

    if (productData.featureGroups && productData.featureGroups.length > 0) {
      // Собираем матрицу features для генерации вариантов
      const featuresMatrix = productData.featureGroups
        .map((fg) => {
          const featureGroup = featureGroupMap[fg.slug];
          if (!featureGroup) {
            console.warn(`   ⚠️  Feature group ${fg.slug} не найдена`);
            return [];
          }

          // Фильтруем только те значения, которые нужны для этого продукта
          return featureGroup.features.filter((f) => fg.values.includes(f.title));
        })
        .filter((arr) => arr.length > 0);

      // Генерируем все комбинации (декартово произведение)
      const cartesianProduct = <T>(arrays: T[][]): T[][] => {
        return arrays.reduce<T[][]>(
          (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
          [[]],
        );
      };

      const combinations = cartesianProduct(featuresMatrix);

      // Создаем варианты для каждой комбинации
      combinations.forEach((combo, index) => {
        const variantTitle = `${productData.title} - ${combo.map((f) => f.title).join(' ')}`;
        const variantSlug = generateVariantSlug(productData.slug, combo.map((f) => f.title));

        variantsToCreate.push({
          title: variantTitle,
          slug: variantSlug,
          price: basePriceCents,
          oldPrice: 0,
          costPrice: 0,
          sku: `${productData.slug}-${index}`,
          stockStatus: 'IN_STOCK',
          categories: categoriesForVariant,
          inListing: true,
          variantSortIndex: index,
          weight: 0,
          weightUnit: WeightUnit.Gr,
          width: 0,
          height: 0,
          length: 0,
          dimensionUnit: DimensionUnit.Cm,
          features: combo.map((feature, idx) => ({
            featureId: feature.id,
            isOption: true,
            isAttribute: true,
            optionSortIndex: idx,
            attributeSortIndex: idx,
            styleType: FeatureStyleType.Radio,
          })),
          gallery: [],
          coverId: null,
        });
      });
    } else {
      // Если нет опций, создаем один базовый вариант
      variantsToCreate.push({
        title: productData.title,
        slug: productData.slug,
        price: basePriceCents,
        oldPrice: 0,
        costPrice: 0,
        sku: productData.slug,
        stockStatus: 'IN_STOCK',
        categories: categoriesForVariant,
        inListing: true,
        variantSortIndex: 0,
        weight: 0,
        weightUnit: WeightUnit.Gr,
        width: 0,
        height: 0,
        length: 0,
        dimensionUnit: DimensionUnit.Cm,
        features: [],
        gallery: [],
        coverId: null,
      });
    }

    const descriptionJson = {
      data: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { nodeIndent: null, nodeTextAlignment: null, nodeLineHeight: null, style: '' },
            content: [
              {
                type: 'text',
                text: productData.description,
              },
            ],
          },
        ],
      },
    };

    // Создаем продукт с подготовленными вариантами
    const productTitle = productData.title || (productData as any).name || productData.slug;
    const product = await api.product.create({
      input: {
        title: productTitle,
        slug: productData.slug,
        status: EntityStatus.Published,
        requiresShipping: true,
        description: {
          html: `<p>${productData.description}</p>`,
          json: JSON.stringify(descriptionJson),
          text: productData.description,
        },
        excerpt: '',
        groups: [],
        tags: tagIds,
        variants: {
          create: variantsToCreate,
        },
      },
    });

    productMap[product.slug] = product;
    console.log(
      `   ✅ Создан продукт: ${productTitle} (${variantsToCreate.length} вариантов)`,
    );
  }

  // Обновляем продукты, добавляя группы
  console.log('\n🔄 Обновление продуктов с группами...');
  for (const productData of PRODUCTS) {
    if (!productData.groups || productData.groups.length === 0) {
      continue;
    }

    const mainProduct = productMap[productData.slug];
    if (!mainProduct) {
      console.warn(`   ⚠️ Продукт ${productData.slug} не найден для добавления групп`);
      continue;
    }

    const groupsToCreate = productData.groups.map((group) => {
      const items = group.items
        .map((item) => {
          const componentProduct = productMap[item.productSlug];
          if (!componentProduct) {
            console.warn(`   ⚠️ Продукт-компонент ${item.productSlug} не найден`);
            return null;
          }

                    let variant;

          // Если есть featureValues, генерируем variantSlug по той же логике что и при создании
          const itemWithFeatures = item as any;
          if (itemWithFeatures.featureValues && itemWithFeatures.featureValues.length > 0) {
            const generatedVariantSlug = generateVariantSlug(item.productSlug, itemWithFeatures.featureValues);
            variant = componentProduct.variants.find((v) => v.slug === generatedVariantSlug);

            if (!variant) {
              console.warn(
                `   ⚠️ Вариант ${generatedVariantSlug} не найден в продукте ${item.productSlug}`,
              );
              return null;
            }
          } else {
            // Fallback к старой логике с variantSlug
            const variantSlug = itemWithFeatures.variantSlug ?? item.productSlug;
            variant = componentProduct.variants.find((v) => v.slug === variantSlug);

            if (!variant) {
              console.warn(
                `   ⚠️ Вариант ${variantSlug} не найден в продукте ${item.productSlug}`,
              );
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
      console.log(`   ✅ Добавлены группы в продукт: ${productData.title}`);
    }
  }

  return productMap;
}

// Функция создания покупателей
export async function seedCustomers(api: TenantApiFixture): Promise<string[]> {
  const customerIds: string[] = [];

  console.log('\\n👤 Creating customers...');

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
    const customer = await api.customer.create({
      ...customerData,
      password: 'Test123!',
      isVerified: true,
      language: 'ru',
    });

    customerIds.push(customer);
    console.log(`   ✅ Создан покупатель: ${customerData.firstName} ${customerData.lastName}`);
  }

  return customerIds;
}

// Функция создания отзывов
export async function seedReviews(
  adminApi: TenantApiFixture,
  productIds: string[],
  customerIds: string[],
): Promise<void> {
  console.log('\n⭐ Создание отзывов...');

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

    // Используем ID первого варианта вместо ID контейнера
    const variantId = product.variants[0]?.id;
    if (!variantId) {
      console.warn(
        `   ⚠️  Продукт ${product.title} не имеет вариантов, пропускаем создание отзывов`,
      );
      continue;
    }

    // Создаем 10-15 отзывов на каждый продукт
    const reviewCount = REVIEW_TEMPLATES.length;

    for (let j = 0; j < reviewCount; j++) {
      const customerId = customerIds[j];
      const reviewerName = reviewerNames[j];
      const reviewTemplate = REVIEW_TEMPLATES[j];

      // Создаем отзыв через admin API
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
          status: ReviewStatus.Approved, // Сразу одобряем отзыв
        },
      });

      console.log(`   ✅ Создан отзыв для ${product.title} от ${reviewerName}`);
    }
  }
}

// Главная функция инициализации
export async function seedProject(adminApi: TenantApiFixture): Promise<void> {
  console.log('🚀 Начало инициализации проекта с тестовыми данными...\n');
  try {
    // 1. Создаем категории
    const categoryMap = await seedCategories(adminApi);

    // 2. Создаем теги
    const tagMap = await seedTags(adminApi);

    // 3. Создаем feature groups (опции)
    const featureGroupMap = await seedFeatureGroups(adminApi);

    // 4. Создаем продукты
    const productMap = await seedProducts(adminApi, categoryMap, tagMap, featureGroupMap);
    const productIds = Object.values(productMap).map((p) => p.id);

    // 5. Создаем покупателей
    const customerIds = await seedCustomers(adminApi);

    // 6. Создаем отзывы
    await seedReviews(adminApi, productIds, customerIds);

    console.log('\n✅ Инициализация проекта завершена успешно!');
    console.log(
      `   📊 Создано: ${CATEGORIES.length} категорий, ${TAGS.length} тегов, ${FEATURE_GROUPS.length} групп опций, ${PRODUCTS.length} продуктов`,
    );
  } catch (error) {
    console.error('❌ Ошибка при инициализации:', error);
    throw error;
  }
}
