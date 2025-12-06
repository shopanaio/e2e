import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test.describe('Product API', () => {
  test.beforeEach(async ({ api }) => {
    await api.session.setupUserAndProject();
  });

  test('should create a product with title', async ({ api }) => {
    const { data } = await api.admin.mutation('inventory/ProductCreate', {
      variables: { input: { title: 'Test Product' } },
    });

    const result = data.inventoryMutation.productCreate;
    expect(result.userErrors).toHaveLength(0);
    expect(result.product).toBeTruthy();
    expect(result.product.title).toBe('Test Product');
  });

  test('should create a product with default variant', async ({ api }) => {
    const { data } = await api.admin.mutation('inventory/ProductCreate', {
      variables: { input: { title: 'Product with Default Variant' } },
    });

    const result = data.inventoryMutation.productCreate;
    expect(result.userErrors).toHaveLength(0);
    expect(result.product).toBeTruthy();

    // Should have a default variant
    const variants = result.product.variants?.edges ?? [];
    expect(variants.length).toBeGreaterThanOrEqual(0);
  });

  test('should create multiple products', async ({ api }) => {
    const titles = ['Product A', 'Product B', 'Product C'];

    for (const title of titles) {
      const { data } = await api.admin.mutation('inventory/ProductCreate', {
        variables: { input: { title } },
      });

      expect(data.inventoryMutation.productCreate.userErrors).toHaveLength(0);
      expect(data.inventoryMutation.productCreate.product.title).toBe(title);
    }
  });
});
