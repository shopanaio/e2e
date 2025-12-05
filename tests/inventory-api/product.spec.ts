import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test('inventory API works', async ({ api }) => {
  const { data } = await api.admin.mutation('inventory/ProductCreate', {
    variables: { input: { title: 'Test' } },
  });

  expect(data).toBeTruthy();
});
