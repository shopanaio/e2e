import { EntityStatus } from '@codegen/admin-gql';
import { CurrencyCode } from '@codegen/client-gql';
import { test } from '@fixtures/api/api';
import { expect } from '@playwright/test';

test.describe('checkout-api: create order from checkout', () => {
  test('creates order via orders service from checkout', async ({ api }) => {
    await api.session.setupClient();
    api.session.setCustomerScope();

    const { data: createdResp } = await api.client.checkout.create({
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createdResp.checkoutMutation.checkoutCreate.id as string;

    api.session.setTenantScope();
    const handle = `order-from-checkout-${Date.now()}`;
    await api.admin.product.create({
      input: {
        title: 'Order From Checkout P1',
        status: EntityStatus.Published,
        slug: `${handle}-p1`,
        groups: [],
        requiresShipping: true,
        tags: [],
        variants: {
          create: [
            api.admin.product.getDefaultVariantInput({
              title: 'V1',
              slug: `${handle}-v1`,
              price: 1000,
              stockStatus: 'IN_STOCK',
              inListing: true,
              variantSortIndex: 0,
              sku: 'SKU-OFC-1',
            }),
          ],
        },
      },
    });
    await api.admin.product.create({
      input: {
        title: 'Order From Checkout P2',
        status: EntityStatus.Published,
        slug: `${handle}-p2`,
        groups: [],
        requiresShipping: true,
        tags: [],
        variants: {
          create: [
            api.admin.product.getDefaultVariantInput({
              title: 'V2',
              slug: `${handle}-v2`,
              price: 2000,
              stockStatus: 'IN_STOCK',
              inListing: true,
              variantSortIndex: 0,
              sku: 'SKU-OFC-2',
            }),
          ],
        },
      },
    });

    api.session.setCustomerScope();
    // Fetch products from client API to get correct purchasable IDs (base64 encoded)
    const variant1 = await api.client.variant.get(`${handle}-v1`);
    const variant2 = await api.client.variant.get(`${handle}-v2`);

    await api.client.checkout.addLines({
      checkoutId,
      lines: [
        { purchasableId: variant1.id, quantity: 1 },
        { purchasableId: variant2.id, quantity: 2 },
      ],
    });

    const { data } = await api.client.order.create({
      checkoutId,
    });

    const orderId = data.orderMutation.orderCreate.id as string;
    expect(orderId).toBeTruthy();

    expect(orderId).toBeTruthy();
    expect(data.orderMutation.orderCreate.status).toBe('DRAFT');
    expect(data.orderMutation.orderCreate.cost.totalAmount.amount).toBe(50);
  });
});
