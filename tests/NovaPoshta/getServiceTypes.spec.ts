import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { serviceTypesResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Технології доставки NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const result: serviceTypesResponse = await np.getServiceTypes();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Description": "Адреса-Адреса",
      "Ref": "DoorsDoors"
    },
    {
      "Description": "Адреса-Відділення",
      "Ref": "DoorsWarehouse"
    },
    {
      "Description": "Відділення-Відділення",
      "Ref": "WarehouseWarehouse"
    },
    {
      "Description": "Відділення-Адреса",
      "Ref": "WarehouseDoors"
    },
    {
      "Description": "Адреса-Поштомат",
      "Ref": "DoorsPostomat"
    },
    {
      "Description": "Відділення-Поштомат",
      "Ref": "WarehousePostomat"
    }
  ])
});