import { EntityStatus } from '@codegen/admin-gql';
import { ApiCheckout, ApiCheckoutCost, CountryCode, CurrencyCode } from '@codegen/client-gql';
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

  test('creates order with delivery context carried from checkout', async ({ api }) => {
    await test.step('setup client and customer scope', async () => {
      await api.session.setupClient();
      api.session.setCustomerScope();
    });

    let checkoutId = '';
    let purchasableId = '';
    const handle = `delivery-context-${Date.now()}`;

    await test.step('create product variant', async () => {
      api.session.setTenantScope();
      await api.admin.product.create({
        input: {
          title: 'Delivery Context Product',
          status: EntityStatus.Published,
          slug: handle,
          groups: [],
          requiresShipping: true,
          tags: [],
          variants: {
            create: [
              api.admin.product.getDefaultVariantInput({
                title: 'Default',
                slug: handle,
                price: 3000,
                stockStatus: 'IN_STOCK',
                inListing: true,
                variantSortIndex: 0,
                sku: `SKU-DC-${Date.now()}`,
              }),
            ],
          },
        },
      });

      api.session.setCustomerScope();
      const variant = await api.client.variant.get(handle);
      purchasableId = variant.id;
      expect(purchasableId).toBeTruthy();
    });

    await test.step('create checkout and add lines', async () => {
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
      expect(checkoutId).toBeTruthy();

      await api.client.checkout.addLines({
        checkoutId,
        lines: [{ purchasableId, quantity: 3 }],
      });
    });

    let selectedDeliveryGroupId = '';

    await test.step('add delivery address, recipient and select method', async () => {
      const { data } = await api.client.checkout.addDeliveryAddresses({
        checkoutId,
        addresses: [
          {
            address1: '111 Delivery Lane',
            city: 'Test City',
            countryCode: CountryCode.Us,
            postalCode: '10001',
            provinceCode: 'NY',
          },
        ],
      });

      const deliveryGroup = data.checkoutMutation.checkoutDeliveryAddressesAdd.deliveryGroups[0];
      expect(deliveryGroup).toBeTruthy();
      selectedDeliveryGroupId = deliveryGroup.id;

      await api.client.checkout.addDeliveryRecipients({
        checkoutId,
        recipients: [
          {
            deliveryGroupId: selectedDeliveryGroupId,
            recipient: {
              firstName: 'Alex',
              lastName: 'Courier',
              email: 'alex.courier@example.com',
            },
          },
        ],
      });

      const { data: readData } = await api.client.checkout.readFull(checkoutId);
      const checkout = readData.checkoutQuery.checkout;
      expect(checkout).toBeTruthy();
      const group = checkout?.deliveryGroups.find(
        (deliveryGroup) => deliveryGroup.id === selectedDeliveryGroupId,
      );
      expect(group?.deliveryMethods.length).toBeGreaterThan(0);
      const method = group?.deliveryMethods[0];
      expect(method).toBeTruthy();

      await api.client.checkout.updateDeliveryMethod({
        checkoutId,
        deliveryGroupId: selectedDeliveryGroupId,
        shippingMethodCode: method?.code ?? '',
        provider: method?.provider?.code ?? '',
      });

      const { data: updatedData } = await api.client.checkout.readFull(checkoutId);
      const updatedGroup = updatedData.checkoutQuery.checkout?.deliveryGroups.find(
        (deliveryGroup) => deliveryGroup.id === selectedDeliveryGroupId,
      );
      expect(updatedGroup?.selectedDeliveryMethod?.code).toBe(method?.code);
    });

    let finalCheckoutCost: ApiCheckoutCost | null = null;
    await test.step('capture checkout cost snapshot', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);
      const checkout = data.checkoutQuery.checkout;
      if (!checkout) {
        throw new Error('Checkout not found');
      }
      finalCheckoutCost = checkout.cost;
      expect(checkout.deliveryGroups.some((group) => group.selectedDeliveryMethod)).toBe(true);
    });

    await test.step('create order and compare cost', async () => {
      if (!finalCheckoutCost) {
        throw new Error('No checkout cost captured');
      }
      const { data } = await api.client.order.create({
        checkoutId,
      });
      const order = data.orderMutation.orderCreate;
      expect(order.id).toBeTruthy();
      expect(order.cost.totalAmount.amount).toBe(finalCheckoutCost.totalAmount.amount);
      expect(order.cost.totalShippingAmount.amount).toBe(
        finalCheckoutCost.totalShippingAmount.amount,
      );
      expect(order.cost.totalDiscountAmount.amount).toBe(
        finalCheckoutCost.totalDiscountAmount.amount,
      );
    });
  });

  test.only('creates order reflecting promo code adjustments', async ({ api }) => {
    await test.step('setup client and customer scope', async () => {
      await api.session.setupClient();
      api.session.setCustomerScope();
    });

    let checkoutId = '';
    let purchasableId = '';
    const handle = `promo-order-${Date.now()}`;

    await test.step('create promo product', async () => {
      api.session.setTenantScope();
      await api.admin.product.create({
        input: {
          title: 'Promo Order Product',
          status: EntityStatus.Published,
          slug: handle,
          groups: [],
          requiresShipping: true,
          tags: [],
          variants: {
            create: [
              api.admin.product.getDefaultVariantInput({
                title: 'Promo',
                slug: handle,
                price: 10000,
                stockStatus: 'IN_STOCK',
                inListing: true,
                variantSortIndex: 0,
                sku: `SKU-PROMO-ORDER-${Date.now()}`,
              }),
            ],
          },
        },
      });

      api.session.setCustomerScope();
      const variant = await api.client.variant.get(handle);
      purchasableId = variant.id;
      expect(purchasableId).toBeTruthy();
    });

    await test.step('create checkout and add promo-eligible lines', async () => {
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
      expect(checkoutId).toBeTruthy();

      await api.client.checkout.addLines({
        checkoutId,
        lines: [{ purchasableId, quantity: 5 }],
      });

      const { data: promoResponse } = await api.client.checkout.addPromoCode({
        checkoutId,
        code: 'SAVE50',
      });

      const checkout = promoResponse.checkoutMutation.checkoutPromoCodeAdd;
      expect(checkout.appliedPromoCodes.length).toBe(1);
      expect(checkout.appliedPromoCodes[0].code).toBe('SAVE50');
      expect(checkout.cost.totalDiscountAmount.amount).toBeGreaterThan(0);

      const { data: confirmed } = await api.client.checkout.readFull(checkoutId);
      expect(confirmed.checkoutQuery.checkout?.cost.totalAmount.amount).toBe(
        checkout.cost.totalAmount.amount,
      );
    });

    await test.step('create order and verify promo adjustments', async () => {
      const finalCheckout = await api.client.checkout.readFull(checkoutId);
      const checkout = finalCheckout.data.checkoutQuery.checkout;
      if (!checkout) {
        throw new Error('Checkout missing before order creation');
      }

      const { data } = await api.client.order.create({
        checkoutId,
      });

      const order = data.orderMutation.orderCreate;
      expect(order.cost.totalAmount.amount).toBe(checkout.cost.totalAmount.amount);
      expect(order.cost.totalDiscountAmount.amount).toBe(checkout.cost.totalDiscountAmount.amount);
    });
  });
});
