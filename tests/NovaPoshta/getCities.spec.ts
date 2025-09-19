import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { citiesProperties, citiesResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Довідник міст компанії NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  // якщо відправити порожній об'єкт - отримаємо список усіх віст України
  const methodProperties: citiesProperties = {
    "FindByString": "Одеса"
  };

  const result: citiesResponse = await np.getCities(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Description": "Одеса",
      "DescriptionRu": "Одесса",
      "Ref": "db5c88d0-391c-11dd-90d9-001a92567626",
      "Delivery1": "1",
      "Delivery2": "1",
      "Delivery3": "1",
      "Delivery4": "1",
      "Delivery5": "1",
      "Delivery6": "1",
      "Delivery7": "1",
      "Area": "71508136-9b87-11de-822f-000c2965ae0e",
      "SettlementType": "563ced10-f210-11e3-8c4a-0050568002cf",
      "IsBranch": "1",
      "PreventEntryNewStreetsUser": "0",
      "CityID": "10",
      "SettlementTypeDescriptionRu": "город",
      "SettlementTypeDescription": "місто",
      "SpecialCashCheck": 1,
      "AreaDescription": "Одеська",
      "AreaDescriptionRu": "Одесская"
    }
  ])
});