import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

// e2e test: неавторизованный пользователь не может создать отзыв

test.describe('StorefrontReviewUnauthorizedCreate', () => {
  test('guest cannot create review', async ({ api }) => {
    // Подготавливаем магазин и товар, но НЕ создаём покупателя (гость)
    await api.session.setupUserAndProject();

    const {
      variants: [{ slug: handle }],
    } = await api.admin.product.create();

    // Ключ API (витрина) нужен даже для гостей
    await api.session.setupApiKey();

    const product = await api.client.product.get(handle);

    // Пытаемся создать отзыв без accessToken
    const { errors } = await api.client.mutation('client/ReviewCreate', {
      throwOnError: false,
      variables: {
        input: {
          productId: product.id,
          rating: 4,
          title: 'Guest review',
          message: 'Should fail',
        },
      },
    });

    expect(errors).toBeTruthy();
  });
});
