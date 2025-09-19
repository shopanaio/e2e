import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';
import { EntityStatus } from '@codegen/admin-gql';
import { randomUUID } from 'node:crypto';
import * as yup from 'yup';

/*
  Тест проверяет возможность привязки лейблов к продукту в момент создания.

  TODO: Переписать тест для использования api.admin.product фикстурных методов вместо ручных GraphQL вызовов
*/

test.describe('Product Labels', () => {
  test('Create product with labels', async ({ api }) => {
    // 1. Пользователь и проект
    await api.session.setupUserAndProject();

    // 2. Создаем два лейбла
    const labelInputs = [
      { name: 'Label Uno', slug: randomUUID(), colorHex: '#aaaaaa' },
      { name: 'Label Dos', slug: randomUUID(), colorHex: '#bbbbbb' },
    ];

    const labels = [] as { id: string; slug: string }[];

    for (const input of labelInputs) {
      const label = await api.admin.label.create({ input });
      labels.push({ id: label.id, slug: label.slug });
    }

    const labelIds = labels.map((l) => l.id);

    // 3. Создаем продукт с этими лейблами
    const product = await api.admin.product.create({
      input: {
        title: 'Product with Labels',
        status: EntityStatus.Draft,
        labels: labelIds,
      },
    });

    // 4. Проверяем, что продукт содержит нужные лейблы
    expect(product.labels.length).toBe(2);

    // Проверка схемы каждого лейбла
    product.labels.forEach((lbl) => {
      expect(lbl).toMatchSchema(
        yup.object({
          id: yup.string().oneOf(labelIds).required(),
          slug: yup.string().required(),
          name: yup.string().required(),
          colorHex: yup.string().nullable(),
        }),
      );
    });

    // 5. Получаем продукт через фикстуру и убеждаемся, что лейблы сохранились
    const fetchedProduct = await api.admin.product.findOne(product.id);

    const fetchedLabels = fetchedProduct.labels || [];
    expect(fetchedLabels.map((l) => l.id).sort()).toEqual(labelIds.sort());
  });
});
