import { ApiCheckoutPayment, CurrencyCode } from '@codegen/client-gql';
import { test } from '@fixtures/api/api';
import { expect } from '@playwright/test';

test.describe('checkout-api: payment method', () => {
  test('should have payment methods available when checkout is created', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';

    await test.step('create checkout', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
      expect(checkoutId).toBeTruthy();
    });

    await test.step('verify payment methods are available', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const checkout = data.checkoutQuery.checkout;
      expect(checkout?.payment).toBeTruthy();

      const payment = checkout?.payment as ApiCheckoutPayment;
      expect(payment.paymentMethods).toBeTruthy();
      expect(payment.paymentMethods.length).toBeGreaterThan(0);

      // Verify payment method structure
      const firstMethod = payment.paymentMethods[0];
      expect(firstMethod.code).toBeTruthy();
      expect(firstMethod.provider).toBeTruthy();
      expect(firstMethod.flow).toBeTruthy();

      // Verify payableAmount exists
      expect(payment.payableAmount).toBeTruthy();
      expect(payment.payableAmount.amount).toBeDefined();
      expect(payment.payableAmount.currencyCode).toBe('USD');

      // Initially no payment method should be selected
      expect(payment.selectedPaymentMethod).toBeNull();
    });
  });

  test('should select payment method for checkout', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';
    let paymentMethodCode = '';

    await test.step('create checkout and get available payment methods', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;

      // Get available payment methods
      const { data: readData } = await api.client.checkout.readFull(checkoutId);

      const payment = readData.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      expect(payment.paymentMethods.length).toBeGreaterThan(0);

      paymentMethodCode = payment.paymentMethods[0].code;
      expect(paymentMethodCode).toBeTruthy();
    });

    await test.step('select payment method', async () => {
      const { data } = await api.client.checkout.updatePaymentMethod({
        checkoutId,
        paymentMethodCode,
      });

      const updatedCheckout = data.checkoutMutation.checkoutPaymentMethodUpdate;

      expect(updatedCheckout.id).toBe(checkoutId);
      expect(updatedCheckout.payment.selectedPaymentMethod).toBeTruthy();
      expect(updatedCheckout.payment.selectedPaymentMethod?.code).toBe(paymentMethodCode);
    });

    await test.step('verify payment method persistence', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      expect(payment.selectedPaymentMethod).toBeTruthy();
      expect(payment.selectedPaymentMethod?.code).toBe(paymentMethodCode);
    });
  });

  test('should change payment method to different one', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';
    let firstMethodCode = '';
    let secondMethodCode = '';

    await test.step('create checkout and select first payment method', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;

      // Get available payment methods
      const { data: readData } = await api.client.checkout.readFull(checkoutId);

      const payment = readData.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const methods = payment.paymentMethods;

      expect(methods.length).toBeGreaterThan(0);
      firstMethodCode = methods[0].code;

      // Select first method
      await api.client.checkout.updatePaymentMethod({
        checkoutId,
        paymentMethodCode: firstMethodCode,
      });
    });

    await test.step('change to different payment method if available', async () => {
      // Get all payment methods
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const differentMethod = payment.paymentMethods.find((m) => m.code !== firstMethodCode);

      if (differentMethod) {
        secondMethodCode = differentMethod.code;

        const { data: updateData } = await api.client.checkout.updatePaymentMethod({
          checkoutId,
          paymentMethodCode: secondMethodCode,
        });

        const updatedPayment = updateData.checkoutMutation.checkoutPaymentMethodUpdate.payment;
        expect(updatedPayment.selectedPaymentMethod?.code).toBe(secondMethodCode);
      } else {
        // If only one method available, verify it's still selected
        expect(payment.selectedPaymentMethod?.code).toBe(firstMethodCode);
      }
    });

    await test.step('verify final payment method selection', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const expectedCode = secondMethodCode || firstMethodCode;
      expect(payment.selectedPaymentMethod?.code).toBe(expectedCode);
    });
  });

  test('should fail to select non-existent payment method', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';

    await test.step('create checkout', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
    });

    await test.step('attempt to select non-existent payment method', async () => {
      const nonExistentCode = 'non_existent_payment_method_code';

      const { errors } = await api.client.mutation('checkout/CheckoutPaymentMethodUpdate', {
        throwOnError: false,
        variables: {
          input: {
            checkoutId,
            paymentMethodCode: nonExistentCode,
          },
        },
      });

      expect(errors?.[0]?.message).toContain('Domain validation failed');
    });
  });

  test('should update payableAmount correctly', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';
    const initialPayableAmount = '0.00';

    await test.step('create empty checkout', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
    });

    await test.step('verify initial payableAmount is zero', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      expect(payment.payableAmount.amount).toBe(initialPayableAmount);
      expect(payment.payableAmount.currencyCode).toBe('USD');
    });

    await test.step('select payment method', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const paymentMethodCode = payment.paymentMethods[0].code;

      const { data: updateData } = await api.client.checkout.updatePaymentMethod({
        checkoutId,
        paymentMethodCode,
      });

      const updatedPayment = updateData.checkoutMutation.checkoutPaymentMethodUpdate.payment;
      expect(updatedPayment.selectedPaymentMethod?.code).toBe(paymentMethodCode);
      expect(updatedPayment.payableAmount).toBeTruthy();
    });
  });

  test('should verify payment method metadata and constraints', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';

    await test.step('create checkout', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
    });

    await test.step('verify payment method has metadata and constraints', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const firstMethod = payment.paymentMethods[0];

      // Verify all required fields exist
      expect(firstMethod.code).toBeTruthy();
      expect(firstMethod.provider).toBeTruthy();
      expect(firstMethod.flow).toBeTruthy();

      // Metadata and constraints are optional but should be defined
      expect(firstMethod.metadata).toBeDefined();
      expect(firstMethod.constraints).toBeDefined();

      // If constraints exist, verify structure
      if (firstMethod.constraints) {
        expect(firstMethod.constraints.shippingMethods).toBeDefined();
        expect(Array.isArray(firstMethod.constraints.shippingMethods)).toBe(true);
      }
    });
  });

  test('should verify payment flow enum values', async ({ api }) => {
    await test.step('setup client', async () => {
      await api.session.setupClient();
    });

    let checkoutId = '';

    await test.step('create checkout', async () => {
      api.session.setCustomerScope();
      const { data } = await api.client.checkout.create({
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
    });

    await test.step('verify payment flow is valid enum value', async () => {
      const { data } = await api.client.checkout.readFull(checkoutId);

      const payment = data.checkoutQuery.checkout?.payment as ApiCheckoutPayment;
      const validFlows = ['ONLINE', 'OFFLINE', 'ON_DELIVERY'];

      payment.paymentMethods.forEach((method) => {
        expect(validFlows).toContain(method.flow);
      });
    });
  });
});
