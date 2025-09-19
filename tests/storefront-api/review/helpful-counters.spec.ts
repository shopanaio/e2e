import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';
import { generateUser } from '@utils/user';

// e2e test: счётчики helpfulYes / helpfulNo от разных клиентов

test.describe('StorefrontReviewHelpfulCounters', () => {
  test('three yes and two no votes are counted correctly', async ({ api }) => {
    await api.session.setupUserAndProject();

    // Создаём продукт и ключ для витрины
    const {
      variants: [{ slug: handle }],
    } = await api.admin.product.create();
    await api.session.setupApiKey();

    const product = await api.client.product.get(handle);
    await api.session.setupCustomer();

    const { id: reviewId } = await api.client.review.create({
      productId: product.id,
      rating: 4,
      title: 'Initial',
      message: 'Initial message',
    });

    // Массив голосов: true = полезно, false = не полезно
    const votes = [true, true, true, false, false];

    for (const helpful of votes) {
      await test.step('vote', async () => {
        api.session.customer.data = generateUser();
        await api.session.setupCustomer();
        const ok = await api.client.review.voteHelpful({ reviewId, helpful });
        expect(ok).toBe(true);
      });
    }

    const finalReview = await api.client.review.findOne(reviewId);
    expect(finalReview?.helpfulYes).toBe(3);
    expect(finalReview?.helpfulNo).toBe(2);
  });
});
