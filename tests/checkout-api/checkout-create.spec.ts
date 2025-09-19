import { CurrencyCode } from '@codegen/client-gql';
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
});
