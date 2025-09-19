import {
  ApiCheckout,
  ApiCheckoutDeliveryAddressesAddInput,
  CurrencyCode,
} from '@codegen/client-gql';
import { CountryCode } from '@codegen/client-gql';
import { test } from '@fixtures/api/api';
import { expect } from '@playwright/test';

test.describe('checkout-api: delivery addresses management', () => {
  test('should add, update and remove delivery addresses', async ({ api }) => {
    await test.step('setup client (tenant, project, apiKey) and customer scope', async () => {
      await api.session.setupClient();
      api.session.setCustomerScope();
    });

    let checkoutId = '';
    let updatedCheckout: ApiCheckout | null = null;

    await test.step('create empty checkout', async () => {
      const { data } = await api.client.checkout.create({
        idempotency: `e2e-${Date.now()}`,
        localeCode: 'en',
        currencyCode: CurrencyCode.Usd,
        items: [],
      });

      checkoutId = data.checkoutMutation.checkoutCreate.id;
      expect(checkoutId).toBeTruthy();
    });

    await test.step('add delivery addresses', async () => {
      const { data } = await api.client.checkout.addDeliveryAddresses({
        checkoutId,
        addresses: [
          {
            address1: '123 Main Street',
            address2: 'Apt 4B',
            city: 'New York',
            countryCode: CountryCode.Us,
            email: 'home@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        ],
      } satisfies ApiCheckoutDeliveryAddressesAddInput);

      updatedCheckout = data.checkoutMutation.checkoutDeliveryAddressesAdd;
      expect(updatedCheckout.id).toBe(checkoutId);
      expect(updatedCheckout.deliveryGroups.length).toBe(1);

      const [groupHome] = updatedCheckout.deliveryGroups;
      expect(groupHome.deliveryAddress?.address1).toBe('123 Main Street');
      expect(groupHome.deliveryAddress?.address2).toBe('Apt 4B');
      expect(groupHome.deliveryAddress?.city).toBe('New York');
      expect(groupHome.deliveryAddress?.countryCode).toBe('US');
      expect(groupHome.deliveryAddress?.firstName).toBe('John');
      expect(groupHome.deliveryAddress?.lastName).toBe('Doe');
      expect(groupHome.deliveryAddress?.email).toBe('home@example.com');
    });

    await test.step('update delivery addresses', async () => {
      const { data } = await api.client.checkout.updateDeliveryAddresses({
        checkoutId,
        updates: [
          {
            addressId: updatedCheckout?.deliveryGroups[0].deliveryAddress?.id as string,
            address: {
              address1: '789 Updated Street',
              address2: 'Suite 10',
              city: 'Brooklyn',
              countryCode: CountryCode.Us,
              email: 'updated@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
            },
          },
        ],
      });

      const updated = data.checkoutMutation.checkoutDeliveryAddressesUpdate;
      expect(updated.id).toBe(checkoutId);
      const deliveryGroup = updated.deliveryGroups.find(
        (g) => g.id === updatedCheckout?.deliveryGroups[0].id,
      );

      const addr = deliveryGroup?.deliveryAddress;
      expect(addr?.address1).toBe('789 Updated Street');
      expect(addr?.address2).toBe('Suite 10');
      expect(addr?.city).toBe('Brooklyn');
      expect(addr?.firstName).toBe('Jane');
      expect(addr?.lastName).toBe('Smith');
      expect(addr?.email).toBe('updated@example.com');
    });

    await test.step('remove delivery address', async () => {
      const addressId = updatedCheckout?.deliveryGroups[0].deliveryAddress?.id;
      const { data } = await api.client.checkout.removeDeliveryAddresses({
        checkoutId,
        addressIds: [addressId as string],
      });

      const { id, deliveryGroups } = data.checkoutMutation.checkoutDeliveryAddressesRemove;
      expect(id).toBe(checkoutId);
      expect(deliveryGroups[0].deliveryAddress).toBeNull();
    });
  });
});
