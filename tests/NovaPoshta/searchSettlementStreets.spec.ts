import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { searchSettlementStreetsProperties, searchSettlementStreetsResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Онлайн пошук вулиць в довіднику населених пунктів NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const methodProperties: searchSettlementStreetsProperties = {
    StreetName: "Хрещатик",
    
    SettlementRef: "e718a680-4b33-11e4-ab6d-005056801329",
  };

  const result: searchSettlementStreetsResponse = await np.searchSettlementStreets(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result.data[0].Addresses)
 */
  expect(result.data[0].Addresses).toEqual([
    {
      SettlementRef: 'e718a680-4b33-11e4-ab6d-005056801329',
      SettlementStreetRef: 'ad090b1f-6845-11e6-8304-00505688561d',
      SettlementStreetDescription: 'Хрещатик',
      Present: 'вул. Хрещатик',
      StreetsType: '0f1d7fbb-4bba-11e4-ab6d-005056801329',
      StreetsTypeDescription: 'вул.',
      Location: { lat: 50.44806099962443, lon: 30.52225599065423 },
      SettlementStreetDescriptionRu: 'Крещатик'
    }
  ])
});