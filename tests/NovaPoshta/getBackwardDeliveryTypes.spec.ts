import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { cargoTypesResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Види зворотної доставки вантажу NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const result: cargoTypesResponse = await np.backwardDelivery();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    { Description: 'Документи', Ref: 'Documents' },
    { Description: 'Грошовий переказ', Ref: 'Money' }
  ])
});