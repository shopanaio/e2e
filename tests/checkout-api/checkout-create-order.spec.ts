import { EntityStatus } from '@codegen/admin-gql';
import { CurrencyCode } from '@codegen/client-gql';
import { test } from '@fixtures/api/api';
import { expect } from '@playwright/test';

test.describe('checkout-api: create order from checkout', () => {
  test('creates order via orders service from checkout', async ({ api }) => {
    await api.session.setupClient();
    api.session.setCustomerScope();

    // 1) Создаём пустой checkout
    const { data: createdResp } = await api.client.checkout.create({
      idempotency: `e2e-${Date.now()}`,
      localeCode: 'en',
      currencyCode: CurrencyCode.Usd,
      items: [],
    });
    const checkoutId = createdResp.checkoutMutation.checkoutCreate.id as string;

    // Добавляем пару линий, чтобы заказ мог создаться
    // Сидапим 2 товара и добавляем их в checkout
    api.session.setTenantScope();
    const handle = `order-from-checkout-${Date.now()}`;
    const p1 = await api.admin.product.create({
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
    const p2 = await api.admin.product.create({
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
    await api.client.checkout.addLines({
      checkoutId,
      lines: [
        { purchasableId: p1.variants[0].id as string, quantity: 1 },
        { purchasableId: p2.variants[0].id as string, quantity: 2 },
      ],
    });

    // 2) Вызываем orders-service для создания заказа из checkout через client API
    const { data } = await api.client.order.create({
      checkoutId,
    });

    console.log('Full response:', JSON.stringify(data, null, 2));

    const orderId = data.orderMutation.orderCreate.id as string;
    expect(orderId).toBeTruthy();

    // 3) Проверяем, что заказ создан и содержит правильные данные
    expect(orderId).toBeTruthy();
    expect(data.orderMutation.orderCreate.status).toBe('DRAFT');
    expect(data.orderMutation.orderCreate.cost.totalAmount.amount).toBeGreaterThan(0);

    // Дополнительная проверка через admin API
    const order = await api.admin.query('admin/OrderFindOne', {
      variables: { findOneId: orderId },
    });

    expect(order.data.orderQuery.findOne?.id).toBe(orderId);
    expect(order.data.orderQuery.findOne?.orderItems.length).toBe(2);

    const quantities = order.data.orderQuery.findOne?.orderItems.map((i) => i.quantity);
    expect(quantities).toEqual([1, 2]);
  });
});
