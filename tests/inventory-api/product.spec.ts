import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test('inventory API works', async ({ api }) => {
  await api.session.setupUserAndProject();

  const { data } = await api.admin.mutation('inventory/ProductCreate', {
    variables: { input: { title: 'Test' } },
  });

  expect(data).toBeTruthy();
});
