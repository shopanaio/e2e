import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { cargoTypesResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Отримання видів вантажу NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  const result: cargoTypesResponse = await np.getCargoTypes();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    { Description: 'Посилка', Ref: 'Parcel' },
    { Description: 'Вантаж', Ref: 'Cargo' },
    { Description: 'Документи', Ref: 'Documents' },
    { Description: 'Шини-диски', Ref: 'TiresWheels' },
    { Description: 'Палети', Ref: 'Pallet' }
  ])
});