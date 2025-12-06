import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test.describe('Warehouse API', () => {
  test.beforeEach(async ({ api }) => {
    await api.session.setupUserAndProject();
  });

  test('should create a warehouse', async ({ api }) => {
    const { data } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-001',
          name: 'Main Warehouse',
          isDefault: true,
        },
      },
    });

    const result = data.inventoryMutation.warehouseCreate;
    expect(result.userErrors).toHaveLength(0);
    expect(result.warehouse).toBeTruthy();
    expect(result.warehouse.code).toBe('WH-001');
    expect(result.warehouse.name).toBe('Main Warehouse');
    expect(result.warehouse.isDefault).toBe(true);
  });

  test('should update a warehouse', async ({ api }) => {
    // Create warehouse first
    const { data: createData } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-002',
          name: 'Secondary Warehouse',
        },
      },
    });

    const warehouseId = createData.inventoryMutation.warehouseCreate.warehouse.id;

    // Update warehouse
    const { data } = await api.admin.mutation('inventory/WarehouseUpdate', {
      variables: {
        input: {
          id: warehouseId,
          name: 'Updated Warehouse Name',
          code: 'WH-002-UPDATED',
        },
      },
    });

    const result = data.inventoryMutation.warehouseUpdate;
    expect(result.userErrors).toHaveLength(0);
    expect(result.warehouse).toBeTruthy();
    expect(result.warehouse.name).toBe('Updated Warehouse Name');
    expect(result.warehouse.code).toBe('WH-002-UPDATED');
  });

  test('should set warehouse as default', async ({ api }) => {
    // Create first warehouse as default
    const { data: firstData } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-DEFAULT-1',
          name: 'First Default',
          isDefault: true,
        },
      },
    });

    const firstWarehouseId = firstData.inventoryMutation.warehouseCreate.warehouse.id;
    expect(firstData.inventoryMutation.warehouseCreate.warehouse.isDefault).toBe(true);

    // Create second warehouse as default - should clear first
    const { data: secondData } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-DEFAULT-2',
          name: 'Second Default',
          isDefault: true,
        },
      },
    });

    expect(secondData.inventoryMutation.warehouseCreate.warehouse.isDefault).toBe(true);
  });

  test('should delete a warehouse', async ({ api }) => {
    // Create warehouse first
    const { data: createData } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-TO-DELETE',
          name: 'Warehouse to Delete',
        },
      },
    });

    const warehouseId = createData.inventoryMutation.warehouseCreate.warehouse.id;

    // Delete warehouse
    const { data } = await api.admin.mutation('inventory/WarehouseDelete', {
      variables: {
        input: {
          id: warehouseId,
        },
      },
    });

    const result = data.inventoryMutation.warehouseDelete;
    expect(result.userErrors).toHaveLength(0);
    expect(result.deletedWarehouseId).toBe(warehouseId);
  });

  test('should return error for duplicate warehouse code', async ({ api }) => {
    // Create first warehouse
    await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-DUPLICATE',
          name: 'Original Warehouse',
        },
      },
    });

    // Try to create warehouse with same code
    const { data } = await api.admin.mutation('inventory/WarehouseCreate', {
      variables: {
        input: {
          code: 'WH-DUPLICATE',
          name: 'Duplicate Warehouse',
        },
      },
      throwOnError: false,
    });

    const result = data.inventoryMutation.warehouseCreate;
    expect(result.warehouse).toBeNull();
    expect(result.userErrors.length).toBeGreaterThan(0);
  });
});
