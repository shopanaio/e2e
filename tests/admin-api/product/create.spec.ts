import { test } from '@fixtures/base.extend';

/**
 * Упрощённый тест создания продукта: теперь используем api.admin.product.create,
 * который объединяет переданные параметры с дефолтными значениями.
 */

test.describe('ProductCreate', () => {
  test('Create', async ({ api }) => {
    // Подготавливаем сессию
    await api.session.setupUserAndProject();

    // Создаём продукт, передавая только изменяемые поля
    const product = await api.admin.product.create();

    // Проверяем схему
    api.admin.product.assertProduct(product);
  });
});
