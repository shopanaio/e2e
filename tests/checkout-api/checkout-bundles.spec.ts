import { EntityStatus, ProductGroupPriceType } from '@codegen/admin-gql';
import { ApiCheckoutLine, CurrencyCode } from '@codegen/client-gql';
import { ApiFixtures, test } from '@fixtures/api/api';
import { expect } from '@playwright/test';

// Extended type for children with bundle-specific fields not yet in codegen
type ChildLine = ApiCheckoutLine & {
  priceConfig?: { type: string; amount?: number; percent?: number };
  originalPrice: { amount: number };
};

// Price config for creating ProductGroup items in the database
type GroupItemPriceConfig = {
  priceType: ProductGroupPriceType;
  priceAmountValue?: number;
  pricePercentageValue?: number;
  maxQuantity?: number;
};

/**
 * E2E tests for checkout bundles (children items) functionality.
 *
 * Tests cover:
 * - Creating bundles with various price types (FREE, BASE, DISCOUNT_*, MARKUP_*, OVERRIDE)
 * - Price calculations for children (prices come from ProductGroup config in DB)
 * - Cascade delete behavior
 * - Update restrictions
 */
test.describe.only('checkout-api: bundles (children items)', () => {
  /**
   * Creates test products with a parent that has ProductGroups configured with child variants.
   * Price configs are set in the ProductGroup items in the database.
   */
  async function createTestProducts(
    api: ApiFixtures['api'],
    prices: { parent: number; child1: number; child2: number },
    groupItems: {
      child1?: GroupItemPriceConfig;
      child2?: GroupItemPriceConfig;
    } = {},
  ) {
    api.session.setTenantScope();
    const timestamp = Date.now();

    // First create child products to get their variant IDs
    const child1Handle = `bundle-child1-${timestamp}`;
    const child1Product = await api.admin.product.create({
      input: {
        title: 'Bundle Child Product 1',
        status: EntityStatus.Published,
        slug: child1Handle,
        groups: [],
        requiresShipping: true,
        tags: [],
        variants: {
          create: [
            api.admin.product.getDefaultVariantInput({
              title: 'Child Variant 1',
              slug: child1Handle,
              price: prices.child1,
              stockStatus: 'IN_STOCK',
              inListing: true,
              variantSortIndex: 0,
              sku: `SKU-CHILD1-${timestamp}`,
            }),
          ],
        },
      },
    });
    const child1VariantId = child1Product.variants[0].id;

    const child2Handle = `bundle-child2-${timestamp}`;
    const child2Product = await api.admin.product.create({
      input: {
        title: 'Bundle Child Product 2',
        status: EntityStatus.Published,
        slug: child2Handle,
        groups: [],
        requiresShipping: true,
        tags: [],
        variants: {
          create: [
            api.admin.product.getDefaultVariantInput({
              title: 'Child Variant 2',
              slug: child2Handle,
              price: prices.child2,
              stockStatus: 'IN_STOCK',
              inListing: true,
              variantSortIndex: 0,
              sku: `SKU-CHILD2-${timestamp}`,
            }),
          ],
        },
      },
    });
    const child2VariantId = child2Product.variants[0].id;

    // Build group items array based on what price configs were provided
    const groupItemsArray = [];
    let sortIndex = 0;

    if (groupItems.child1) {
      groupItemsArray.push({
        variantId: child1VariantId,
        sortIndex: sortIndex++,
        priceType: groupItems.child1.priceType,
        priceAmountValue: groupItems.child1.priceAmountValue,
        pricePercentageValue: groupItems.child1.pricePercentageValue,
        maxQuantity: groupItems.child1.maxQuantity,
      });
    }

    if (groupItems.child2) {
      groupItemsArray.push({
        variantId: child2VariantId,
        sortIndex: sortIndex++,
        priceType: groupItems.child2.priceType,
        priceAmountValue: groupItems.child2.priceAmountValue,
        pricePercentageValue: groupItems.child2.pricePercentageValue,
        maxQuantity: groupItems.child2.maxQuantity,
      });
    }

    // Create parent product first (without groups)
    const parentHandle = `bundle-parent-${timestamp}`;
    const parentProduct = await api.admin.product.create({
      input: {
        title: 'Bundle Parent Product',
        status: EntityStatus.Published,
        slug: parentHandle,
        groups: [],
        requiresShipping: true,
        tags: [],
        variants: {
          create: [
            api.admin.product.getDefaultVariantInput({
              title: 'Parent Variant',
              slug: parentHandle,
              price: prices.parent,
              stockStatus: 'IN_STOCK',
              inListing: true,
              variantSortIndex: 0,
              sku: `SKU-PARENT-${timestamp}`,
            }),
          ],
        },
      },
    });

    // Add groups via update (groups can only be added after product creation)
    if (groupItemsArray.length > 0) {
      await api.admin.product.update({
        input: {
          id: parentProduct.id,
          groups: {
            create: [
              {
                title: 'Bundle Items',
                isRequired: false,
                isMultiple: true,
                sortIndex: 0,
                items: groupItemsArray,
              },
            ],
          },
        },
      });
    }

    api.session.setCustomerScope();
    const parentVariant = await api.client.variant.get(parentHandle);
    const child1Variant = await api.client.variant.get(child1Handle);
    const child2Variant = await api.client.variant.get(child2Handle);

    console.log('Parent variant from client API:', JSON.stringify(parentVariant, null, 2));
    console.log('Parent product ID from admin API:', parentProduct.id);
    console.log('Parent variant ID from admin API:', parentProduct.variants[0].id);

    return {
      parentId: parentVariant.id,
      child1Id: child1Variant.id,
      child2Id: child2Variant.id,
      prices,
    };
  }

  test('should create bundle with FREE children', async ({ api }) => {
    await api.session.setupClient();

    // Create products with FREE price config in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.Free } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    // Note: priceType is NOT sent - it comes from ProductGroup in DB
    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    expect(checkout?.lines).toHaveLength(1);

    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    expect(parentLine.children).toHaveLength(1);

    const childLine = parentLine.children[0] as ChildLine;
    expect(childLine.priceConfig?.type).toBe('FREE');
    expect(childLine.cost.unitPrice.amount).toBe(0);
    expect(childLine.originalPrice.amount).toBe(20);

    expect(checkout?.cost.totalAmount.amount).toBe(50);
  });

  test('should create bundle with BASE children (no adjustment)', async ({ api }) => {
    await api.session.setupClient();

    // Create products with BASE price config in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.Base } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    const childLine = parentLine.children[0] as ChildLine;

    expect(childLine.priceConfig?.type).toBe('BASE');
    expect(childLine.cost.unitPrice.amount).toBe(20);
    expect(childLine.originalPrice.amount).toBe(20);

    expect(checkout?.cost.totalAmount.amount).toBe(70);
  });

  test('should create bundle with DISCOUNT_PERCENT children', async ({ api }) => {
    await api.session.setupClient();

    // Create products with BASE_ADJUST_PERCENT (maps to DISCOUNT_PERCENT) in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseAdjustPercent, pricePercentageValue: 25 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    const childLine = parentLine.children[0] as ChildLine;

    expect(childLine.priceConfig?.type).toBe('DISCOUNT_PERCENT');
    expect(childLine.priceConfig?.percent).toBe(25);
    expect(childLine.originalPrice.amount).toBe(20);
    expect(childLine.cost.unitPrice.amount).toBe(15);

    expect(checkout?.cost.totalAmount.amount).toBe(65);
  });

  test('should create bundle with DISCOUNT_AMOUNT children', async ({ api }) => {
    await api.session.setupClient();

    // Create products with BASE_ADJUST_AMOUNT (maps to DISCOUNT_AMOUNT) in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseAdjustAmount, priceAmountValue: 500 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    const childLine = parentLine.children[0] as ChildLine;

    expect(childLine.priceConfig?.type).toBe('DISCOUNT_AMOUNT');
    expect(childLine.priceConfig?.amount).toBe(500);
    expect(childLine.originalPrice.amount).toBe(20);
    expect(childLine.cost.unitPrice.amount).toBe(15);

    expect(checkout?.cost.totalAmount.amount).toBe(65);
  });

  // Note: MARKUP_PERCENT and MARKUP_AMOUNT are not supported by the platform ProductGroup
  // The platform only supports: FREE, BASE, BASE_ADJUST_AMOUNT, BASE_ADJUST_PERCENT, BASE_OVERRIDE

  test('should create bundle with OVERRIDE children', async ({ api }) => {
    await api.session.setupClient();

    // Create products with BASE_OVERRIDE (maps to OVERRIDE) in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseOverride, priceAmountValue: 999 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    const childLine = parentLine.children[0] as ChildLine;

    expect(childLine.priceConfig?.type).toBe('OVERRIDE');
    expect(childLine.priceConfig?.amount).toBe(999);
    expect(childLine.originalPrice.amount).toBe(20);
    expect(childLine.cost.unitPrice.amount).toBe(9.99);

    expect(checkout?.cost.totalAmount.amount).toBe(59.99);
  });

  test('should create bundle with multiple children and mixed price types', async ({ api }) => {
    await api.session.setupClient();

    // Create products with multiple price configs in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      {
        child1: { priceType: ProductGroupPriceType.BaseAdjustPercent, pricePercentageValue: 10 },
        child2: { priceType: ProductGroupPriceType.Free },
      },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 2,
            },
            {
              purchasableId: products.child2Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    expect(checkout?.lines).toHaveLength(1);

    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    expect(parentLine.children).toHaveLength(2);

    const children = parentLine.children as ChildLine[];
    const child1 = children.find((c) => c.purchasableId === products.child1Id);
    const child2 = children.find((c) => c.purchasableId === products.child2Id);

    expect(child1?.quantity).toBe(2);
    expect(child1?.cost.unitPrice.amount).toBe(18);
    expect(child1?.cost.subtotalAmount.amount).toBe(36);

    expect(child2?.quantity).toBe(1);
    expect(child2?.cost.unitPrice.amount).toBe(0);

    expect(checkout?.cost.totalAmount.amount).toBe(86);
  });

  test('should cascade delete children when parent is removed', async ({ api }) => {
    await api.session.setupClient();

    // Create products with both children in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      {
        child1: { priceType: ProductGroupPriceType.Base },
        child2: { priceType: ProductGroupPriceType.Free },
      },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data: addData } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
            {
              purchasableId: products.child2Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    const addedCheckout = addData.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLineId = (addedCheckout?.lines[0] as ApiCheckoutLine).id;
    expect((addedCheckout?.lines[0] as ApiCheckoutLine).children).toHaveLength(2);

    const { data: deleteData } = await api.client.checkout.deleteLines({
      checkoutId,
      lineIds: [parentLineId],
    });

    const checkoutAfterDelete = deleteData.checkoutMutation.checkoutLinesDelete.checkout;
    expect(checkoutAfterDelete?.lines).toHaveLength(0);
    expect(checkoutAfterDelete?.totalQuantity).toBe(0);
    expect(checkoutAfterDelete?.cost.totalAmount.amount).toBe(0);
  });

  test('should update parent quantity without affecting children quantities', async ({ api }) => {
    await api.session.setupClient();

    // Create products with child in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.Base } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data: addData } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 2,
            },
          ],
        },
      ],
    });

    const addedCheckout = addData.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLineId = (addedCheckout?.lines[0] as ApiCheckoutLine).id;
    const initialChildQty = (
      (addedCheckout?.lines[0] as ApiCheckoutLine).children[0] as ApiCheckoutLine
    ).quantity;
    expect(initialChildQty).toBe(2);

    const { data: updateData } = await api.client.checkout.updateLines({
      checkoutId,
      lines: [{ lineId: parentLineId, quantity: 3 }],
    });

    const checkout = updateData.checkoutMutation.checkoutLinesUpdate.checkout;
    expect((checkout?.lines[0] as ApiCheckoutLine).quantity).toBe(3);

    const { data: readData } = await api.client.checkout.readWithChildren(checkoutId);
    const parentLine = readData.checkoutQuery.checkout?.lines[0] as ApiCheckoutLine;

    expect(parentLine.quantity).toBe(3);
    expect((parentLine.children[0] as ApiCheckoutLine).quantity).toBe(2);
  });

  test('should block direct update of child line', async ({ api }) => {
    await api.session.setupClient();

    // Create products with child in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.Base } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data: addData } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    const addedCheckout = addData.checkoutMutation.checkoutLinesAdd.checkout;
    const childLineId = (
      (addedCheckout?.lines[0] as ApiCheckoutLine).children[0] as ApiCheckoutLine
    ).id;

    const { data: updateData, errors } = await api.client.checkout.updateLines({
      checkoutId,
      lines: [{ lineId: childLineId, quantity: 5 }],
    });

    const hasError =
      (errors?.length ?? 0) > 0 ||
      (updateData.checkoutMutation.checkoutLinesUpdate.errors?.length ?? 0) > 0;

    if (!hasError) {
      const { data: readData } = await api.client.checkout.readWithChildren(checkoutId);
      const childLine = (readData.checkoutQuery.checkout?.lines[0] as ApiCheckoutLine)
        .children[0] as ApiCheckoutLine;
      expect(childLine.quantity).toBe(1);
    } else {
      expect(hasError).toBe(true);
    }
  });

  // Note: Validation tests for negative priceAmount/pricePercent are no longer relevant
  // because price config now comes from ProductGroup in the database, not from client input.

  test('should reject child that is not in parent ProductGroup', async ({ api }) => {
    await api.session.setupClient();

    // Create products but WITHOUT child2 in the ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.Base } }, // Only child1 in group, not child2
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    // Try to add child2 which is NOT in the parent's ProductGroup
    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child2Id, // child2 is NOT in parent's group
              quantity: 1,
            },
          ],
        },
      ],
    });

    // Should get an error because child2 is not in parent's ProductGroup
    const hasError =
      (errors?.length ?? 0) > 0 ||
      (data?.checkoutMutation?.checkoutLinesAdd?.errors?.length ?? 0) > 0;
    expect(hasError).toBe(true);
  });

  test('should clamp price to zero when discount exceeds original price', async ({ api }) => {
    await api.session.setupClient();

    // Create products with large discount (5000 cents = $50) that exceeds child price ($20)
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseAdjustAmount, priceAmountValue: 5000 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const childLine = (checkout?.lines[0] as ApiCheckoutLine).children[0] as ChildLine;

    expect(childLine.cost.unitPrice.amount).toBe(0);
    expect(childLine.originalPrice.amount).toBe(20);

    expect(checkout?.cost.totalAmount.amount).toBe(50);
  });

  test('should handle bundle with child quantity > 1', async ({ api }) => {
    await api.session.setupClient();

    // Create products with DISCOUNT_PERCENT in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 1000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseAdjustPercent, pricePercentageValue: 20 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 2,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 3,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const parentLine = checkout?.lines[0] as ApiCheckoutLine;
    const childLine = parentLine.children[0] as ApiCheckoutLine;

    expect(parentLine.quantity).toBe(2);
    expect(childLine.quantity).toBe(3);
    expect(childLine.cost.unitPrice.amount).toBe(8);
    expect(childLine.cost.subtotalAmount.amount).toBe(24);

    expect(checkout?.cost.totalAmount.amount).toBe(124);
  });

  test('should create bundle without children (regular line)', async ({ api }) => {
    await api.session.setupClient();

    // Create products without any children in ProductGroup (empty groups)
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      {}, // No group items
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    expect(checkout?.lines).toHaveLength(1);
    expect((checkout?.lines[0] as ApiCheckoutLine).children).toHaveLength(0);
    expect(checkout?.cost.totalAmount.amount).toBe(50);
  });

  test('should handle 100% discount', async ({ api }) => {
    await api.session.setupClient();

    // Create products with 100% discount in ProductGroup
    const products = await createTestProducts(
      api,
      { parent: 5000, child1: 2000, child2: 1500 },
      { child1: { priceType: ProductGroupPriceType.BaseAdjustPercent, pricePercentageValue: 100 } },
    );

    api.session.setCustomerScope();

    const { data: createData } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createData.checkoutMutation.checkoutCreate.id;

    const { data, errors } = await api.client.checkout.addLinesWithChildren({
      checkoutId,
      lines: [
        {
          purchasableId: products.parentId,
          quantity: 1,
          children: [
            {
              purchasableId: products.child1Id,
              quantity: 1,
            },
          ],
        },
      ],
    });

    expect(errors).toBeFalsy();

    const checkout = data.checkoutMutation.checkoutLinesAdd.checkout;
    const childLine = (checkout?.lines[0] as ApiCheckoutLine).children[0] as ApiCheckoutLine;

    expect(childLine.cost.unitPrice.amount).toBe(0);
    expect(checkout?.cost.totalAmount.amount).toBe(50);
  });
});
