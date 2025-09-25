import { ApiCheckout, CurrencyCode } from '@codegen/client-gql';
import { EntityStatus } from '@codegen/admin-gql';
import { test } from '@fixtures/api/api';
import { expect } from '@playwright/test';
import crypto from 'crypto';

test.describe('checkout-api: create checkout', () => {
  test('creates checkout via GraphQL', async ({ api }) => {
    await api.session.setupClient();
    api.session.setCustomerScope();

    const input = {
      idempotency: `e2e-${Date.now()}`,
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    };

    const { data } = await api.client.checkout.create(input);

    const created = data.checkoutMutation.checkoutCreate as {
      id: string;
      cost: {
        subtotalAmount: { amount: number; currencyCode: string };
        totalAmount: { amount: number; currencyCode: string };
      };
      totalQuantity: number;
    };

    expect(created.id).toBeTruthy();
    expect(created.totalQuantity).toBe(0);
    expect(created.cost.subtotalAmount.amount).toBe('0.00');
    expect(created.cost.totalAmount.amount).toBe('0.00');
    expect(created.cost.totalAmount.currencyCode).toBe('USD');
  });

  test('is idempotent for the same idempotency', async ({ api }) => {
    await api.session.setupClient();
    api.session.setCustomerScope();

    const idempotency = `e2e-${crypto.randomUUID()}`;
    const input = {
      idempotency,
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    };

    const { data: data1 } = await api.client.checkout.create(input);
    const created1 = data1.checkoutMutation.checkoutCreate as {
      id: string;
      cost: { totalAmount: { amount: number } };
      totalQuantity: number;
    };

    const { data: data2 } = await api.client.checkout.create(input);
    const created2 = data2.checkoutMutation.checkoutCreate as {
      id: string;
      cost: { totalAmount: { amount: number } };
      totalQuantity: number;
    };

    expect(created2.id).toBe(created1.id);
    expect(created2.totalQuantity).toBe(created1.totalQuantity);
    expect(created2.cost.totalAmount.amount).toBe(created1.cost.totalAmount.amount);
  });

  test('creates checkout with items in create mutation same as adding items separately', async ({
    api,
  }) => {
    await api.session.setupClient();

    let purchasableId = '';
    const unitPrice = 2500; // $25.00

    // Create product variant for testing
    await test.step('create product variant', async () => {
      api.session.setTenantScope();
      const handle = `test-product-${Date.now()}`;

      await api.admin.product.create({
        input: {
          title: 'Checkout With Items Test Product',
          status: EntityStatus.Published,
          slug: handle,
          groups: [],
          requiresShipping: true,
          tags: [],
          variants: {
            create: [
              api.admin.product.getDefaultVariantInput({
                title: 'Test Variant',
                slug: handle,
                price: unitPrice,
                stockStatus: 'IN_STOCK',
                inListing: true,
                variantSortIndex: 0,
                sku: 'SKU-CWI-1',
              }),
            ],
          },
        },
      });

      // Get purchasable ID from client API
      api.session.setCustomerScope();
      const variant = await api.client.product.get(handle);
      purchasableId = variant.id;
      expect(purchasableId).toBeTruthy();
    });

    let checkoutWithItemsInCreate: ApiCheckout;
    let checkoutWithSeparateAdd: ApiCheckout;

    // Method 1: Create checkout with items in create mutation
    await test.step('create checkout with items in create mutation', async () => {
      const { data } = await api.client.checkout.create({
        idempotency: `e2e-with-items-${Date.now()}`,
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [
          {
            purchasableId,
            quantity: 2,
          },
        ],
      });

      checkoutWithItemsInCreate = data.checkoutMutation.checkoutCreate;
      expect(checkoutWithItemsInCreate.id).toBeTruthy();
      expect(checkoutWithItemsInCreate.totalQuantity).toBe(2);
      expect(checkoutWithItemsInCreate.lines.length).toBe(1);
    });

    // Method 2: Create empty checkout and add items separately
    await test.step('create empty checkout and add items separately', async () => {
      // Create empty checkout
      const { data: createData } = await api.client.checkout.create({
        idempotency: `e2e-separate-${Date.now()}`,
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      const emptyCheckoutId = createData.checkoutMutation.checkoutCreate.id;

      // Add items to checkout
      const { data: addData } = await api.client.checkout.addLines({
        checkoutId: emptyCheckoutId,
        lines: [
          {
            purchasableId,
            quantity: 2,
          },
        ],
      });

      const checkout = addData.checkoutMutation.checkoutLinesAdd.checkout;
      expect(checkout).toBeTruthy();
      checkoutWithSeparateAdd = checkout as ApiCheckout;
      expect(checkoutWithSeparateAdd.id).toBeTruthy();
      expect(checkoutWithSeparateAdd.totalQuantity).toBe(2);
      expect(checkoutWithSeparateAdd.lines.length).toBe(1);
    });

    // Compare results - they should be identical
    await test.step('compare checkout results', async () => {
      expect(checkoutWithItemsInCreate.totalQuantity).toBe(checkoutWithSeparateAdd.totalQuantity);
      expect(checkoutWithItemsInCreate.lines.length).toBe(checkoutWithSeparateAdd.lines.length);

      // Compare line properties
      const lineInCreate = checkoutWithItemsInCreate.lines[0];
      const lineInSeparate = checkoutWithSeparateAdd.lines[0];

      expect(lineInCreate.quantity).toBe(lineInSeparate.quantity);
      expect(lineInCreate.purchasableId).toBe(lineInSeparate.purchasableId);
      expect(lineInCreate.cost.unitPrice.amount).toBe(lineInSeparate.cost.unitPrice.amount);
      expect(lineInCreate.cost.totalAmount.amount).toBe(lineInSeparate.cost.totalAmount.amount);

      // Compare checkout costs
      expect(checkoutWithItemsInCreate.cost.subtotalAmount.amount).toBe(
        checkoutWithSeparateAdd.cost.subtotalAmount.amount,
      );
      expect(checkoutWithItemsInCreate.cost.totalAmount.amount).toBe(
        checkoutWithSeparateAdd.cost.totalAmount.amount,
      );
      expect(checkoutWithItemsInCreate.cost.totalAmount.currencyCode).toBe('USD');
      expect(checkoutWithSeparateAdd.cost.totalAmount.currencyCode).toBe('USD');

      // Verify expected total amount
      const expectedTotal = ((unitPrice / 100) * 2).toFixed(2);
      expect(checkoutWithItemsInCreate.cost.totalAmount.amount).toBe(expectedTotal);
      expect(checkoutWithSeparateAdd.cost.totalAmount.amount).toBe(expectedTotal);
    });
  });
});
