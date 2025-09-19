import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';
import { generateUser } from '@utils/user';

// e2e test: пользователь не может менять чужой отзыв

test.describe('StorefrontReviewForeignUpdateDelete', () => {
  test('cannot update or delete review of another customer', async ({ api }) => {
    // Tenant, проект, api key и первый покупатель-A
    await api.session.setupUserAndProject();
    const {
      variants: [{ slug: handle }],
    } = await api.admin.product.create();
    await api.session.setupApiKey();
    await api.session.setupCustomer(); // Customer A

    const product = await api.client.product.get(handle);

    const review = await api.client.review.create({
      productId: product.id,
      rating: 3,
      title: 'Mine',
      message: 'My review',
    });

    // ---- Регистрируем другого покупателя (Customer B) ----
    const userB = generateUser();
    const { data: signUpData } = await api.client.auth.passwordSignUp({
      email: userB.email,
      password: userB.password,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokenB = (signUpData as any)?.passwordSignUp?.session?.accessToken as string;
    expect(tokenB).toBeTruthy();
    api.session.customer.data = userB;
    api.session.customer.accessToken = tokenB;

    // Пытаемся изменить чужой отзыв
    const { errors: updateErrors } = await api.client.mutation('client/ReviewUpdate', {
      throwOnError: false,
      variables: {
        input: {
          id: review.id,
          title: 'Hacked',
        },
      },
    });
    expect(updateErrors).toBeTruthy();

    // Пытаемся удалить чужой отзыв
    const { errors: deleteErrors } = await api.client.mutation('client/ReviewDelete', {
      throwOnError: false,
      variables: { id: review.id },
    });
    expect(deleteErrors).toBeTruthy();
  });
});
