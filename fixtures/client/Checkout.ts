import {
  ApiCheckoutCreateInput,
  ApiCheckoutLinesAddInput,
  ApiCheckoutLinesUpdateInput,
  ApiCheckoutLinesDeleteInput,
  ApiCheckoutLinesClearInput,
  ApiCheckoutPromoCodeAddInput,
  ApiCheckoutPromoCodeRemoveInput,
  ApiCheckoutCustomerIdentityUpdateInput,
  ApiCheckoutCustomerNoteUpdateInput,
  ApiCheckoutDeliveryMethodUpdateInput,
  ApiCheckoutDeliveryAddressesAddInput,
  ApiCheckoutDeliveryAddressesUpdateInput,
  ApiCheckoutDeliveryAddressesRemoveInput,
  ApiCheckoutDeliveryRecipientsAddInput,
  ApiCheckoutDeliveryRecipientsUpdateInput,
  ApiCheckoutDeliveryRecipientsRemoveInput,
  ApiCheckoutPaymentMethodUpdateInput,
} from '@codegen/client-gql';
import { ClientApiFixture } from '@fixtures/client/api';

export class Checkout {
  constructor(private client: ClientApiFixture) {}

  async create(input: ApiCheckoutCreateInput) {
    return this.client.mutation('checkout/CheckoutCreate', {
      throwOnError: false,
      variables: { input },
    });
  }

  async read(id: string) {
    return this.client.query('checkout/CheckoutById', {
      variables: { id },
    });
  }

  async readFull(id: string) {
    return this.client.query('checkout/CheckoutByIdFull', {
      variables: { id },
    });
  }

  async addLines(input: ApiCheckoutLinesAddInput) {
    return this.client.mutation('checkout/CheckoutLinesAdd', {
      variables: { input },
    });
  }

  async updateLines(input: ApiCheckoutLinesUpdateInput) {
    return this.client.mutation('checkout/CheckoutLinesUpdate', {
      variables: { input },
    });
  }

  async deleteLines(input: ApiCheckoutLinesDeleteInput) {
    return this.client.mutation('checkout/CheckoutLinesDelete', {
      variables: { input },
    });
  }

  async clearLines(input: ApiCheckoutLinesClearInput) {
    return this.client.mutation('checkout/CheckoutLinesClear', {
      variables: { input },
    });
  }

  async addPromoCode(input: ApiCheckoutPromoCodeAddInput) {
    return this.client.mutation('checkout/CheckoutPromoCodeAdd', {
      variables: { input },
    });
  }

  async removePromoCode(input: ApiCheckoutPromoCodeRemoveInput) {
    return this.client.mutation('checkout/CheckoutPromoCodeRemove', {
      variables: { input },
    });
  }

  async updateCustomerIdentity(input: ApiCheckoutCustomerIdentityUpdateInput) {
    return this.client.mutation('checkout/CheckoutCustomerIdentityUpdate', {
      variables: { input },
    });
  }

  async updateCustomerNote(input: ApiCheckoutCustomerNoteUpdateInput) {
    return this.client.mutation('checkout/CheckoutCustomerNoteUpdate', {
      variables: { input },
    });
  }

  async updateDeliveryMethod(input: ApiCheckoutDeliveryMethodUpdateInput) {
    return this.client.mutation('checkout/CheckoutDeliveryMethodUpdate', {
      variables: { input },
    });
  }

  async addDeliveryAddresses(input: ApiCheckoutDeliveryAddressesAddInput) {
    return this.client.mutation('checkout/CheckoutDeliveryAddressesAdd', {
      variables: { input },
    });
  }

  async updateDeliveryAddresses(input: ApiCheckoutDeliveryAddressesUpdateInput) {
    return this.client.mutation('checkout/CheckoutDeliveryAddressesUpdate', {
      variables: { input },
    });
  }

  async removeDeliveryAddresses(input: ApiCheckoutDeliveryAddressesRemoveInput) {
    return this.client.mutation('checkout/CheckoutDeliveryAddressesRemove', {
      variables: { input },
    });
  }

  async addDeliveryRecipients(input: ApiCheckoutDeliveryRecipientsAddInput) {
    return this.client.mutation('checkout/CheckoutDeliveryRecipientsAdd', {
      variables: { input },
    });
  }

  async updateDeliveryRecipients(input: ApiCheckoutDeliveryRecipientsUpdateInput) {
    return this.client.mutation('checkout/CheckoutDeliveryRecipientsUpdate', {
      variables: { input },
    });
  }

  async removeDeliveryRecipients(input: ApiCheckoutDeliveryRecipientsRemoveInput) {
    return this.client.mutation('checkout/CheckoutDeliveryRecipientsRemove', {
      variables: { input },
    });
  }

  async updatePaymentMethod(input: ApiCheckoutPaymentMethodUpdateInput) {
    return this.client.mutation('checkout/CheckoutPaymentMethodUpdate', {
      variables: { input },
    });
  }
}
