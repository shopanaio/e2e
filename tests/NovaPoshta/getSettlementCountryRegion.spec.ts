import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { settlementsCountryRegionProperties, settlementsCountryRegionResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Довідник районів областей населених пунктів NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  const methodProperties: settlementsCountryRegionProperties = {
    AreaRef: "dcaade6d-4b33-11e4-ab6d-005056801329" // Odessa
  };

  const result: settlementsCountryRegionResponse = await np.getSettlementCountryRegion(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Ref": "e4abe7d0-4b33-11e4-ab6d-005056801329",
      "Description": "Ананьївський",
      "RegionType": "район",
      "AreasCenter": "e71414e9-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4aeeb71-4b33-11e4-ab6d-005056801329",
      "Description": "Арцизький",
      "RegionType": "район",
      "AreasCenter": "e7143498-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4aee979-4b33-11e4-ab6d-005056801329",
      "Description": "Балтський",
      "RegionType": "район",
      "AreasCenter": "e714480b-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad58e3-4b33-11e4-ab6d-005056801329",
      "Description": "Березівський",
      "RegionType": "район",
      "AreasCenter": "e7147128-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4b13323-4b33-11e4-ab6d-005056801329",
      "Description": "Білгород-Дністровська",
      "RegionType": "міська рада",
      "AreasCenter": "e714885f-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad59d7-4b33-11e4-ab6d-005056801329",
      "Description": "Білгород-Дністровський",
      "RegionType": "район",
      "AreasCenter": "e714885f-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5ad1-4b33-11e4-ab6d-005056801329",
      "Description": "Біляївський",
      "RegionType": "район",
      "AreasCenter": "e714bf8a-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5bd4-4b33-11e4-ab6d-005056801329",
      "Description": "Болградський",
      "RegionType": "район",
      "AreasCenter": "e714d9f8-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5cd3-4b33-11e4-ab6d-005056801329",
      "Description": "Великомихайлівський",
      "RegionType": "район",
      "AreasCenter": "e715a9ee-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6c23-4b33-11e4-ab6d-005056801329",
      "Description": "Захарівський",
      "RegionType": "район",
      "AreasCenter": "e71f86ff-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5ded-4b33-11e4-ab6d-005056801329",
      "Description": "Іванівський",
      "RegionType": "район",
      "AreasCenter": "e7182508-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5ec2-4b33-11e4-ab6d-005056801329",
      "Description": "Ізмаїльський",
      "RegionType": "район",
      "AreasCenter": "e71831b7-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad5f8e-4b33-11e4-ab6d-005056801329",
      "Description": "Кілійський",
      "RegionType": "район",
      "AreasCenter": "e718b009-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6054-4b33-11e4-ab6d-005056801329",
      "Description": "Кодимський",
      "RegionType": "район",
      "AreasCenter": "e71903b6-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6124-4b33-11e4-ab6d-005056801329",
      "Description": "Лиманський",
      "RegionType": "район",
      "AreasCenter": "e7191d75-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad646f-4b33-11e4-ab6d-005056801329",
      "Description": "Любашівський",
      "RegionType": "район",
      "AreasCenter": "e71ac1a9-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad655b-4b33-11e4-ab6d-005056801329",
      "Description": "Миколаївський",
      "RegionType": "район",
      "AreasCenter": "e71b108c-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6649-4b33-11e4-ab6d-005056801329",
      "Description": "Овідіопольський",
      "RegionType": "район",
      "AreasCenter": "e71c2698-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "9332fcaa-7aa3-11ec-80fb-b8830365bd04",
      "Description": "Одеський",
      "RegionType": "район",
      "AreasCenter": "e71c2a15-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad62be-4b33-11e4-ab6d-005056801329",
      "Description": "Окнянський",
      "RegionType": "район",
      "AreasCenter": "e71a0ab6-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad61ef-4b33-11e4-ab6d-005056801329",
      "Description": "Подільський",
      "RegionType": "район",
      "AreasCenter": "e719e8d7-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6721-4b33-11e4-ab6d-005056801329",
      "Description": "Ренійський",
      "RegionType": "район",
      "AreasCenter": "e71d60db-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad67f1-4b33-11e4-ab6d-005056801329",
      "Description": "Роздільнянський",
      "RegionType": "район",
      "AreasCenter": "e71d77cd-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad68cc-4b33-11e4-ab6d-005056801329",
      "Description": "Савранський",
      "RegionType": "район",
      "AreasCenter": "e71d947c-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad699b-4b33-11e4-ab6d-005056801329",
      "Description": "Саратський",
      "RegionType": "район",
      "AreasCenter": "e71d9c62-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6a73-4b33-11e4-ab6d-005056801329",
      "Description": "Тарутинський",
      "RegionType": "район",
      "AreasCenter": "e71ee3fd-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6b4a-4b33-11e4-ab6d-005056801329",
      "Description": "Татарбунарський",
      "RegionType": "район",
      "AreasCenter": "e71ee84a-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6ec2-4b33-11e4-ab6d-005056801329",
      "Description": "Теплодарська",
      "RegionType": "міська рада",
      "AreasCenter": "e71ef0e2-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6de5-4b33-11e4-ab6d-005056801329",
      "Description": "Чорноморська",
      "RegionType": "міська рада",
      "AreasCenter": "e7183bf7-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad6cfc-4b33-11e4-ab6d-005056801329",
      "Description": "Ширяївський",
      "RegionType": "район",
      "AreasCenter": "e7204124-4b33-11e4-ab6d-005056801329"
    },
    {
      "Ref": "e4ad9f84-4b33-11e4-ab6d-005056801329",
      "Description": "Южненська",
      "RegionType": "міська рада",
      "AreasCenter": "e720736f-4b33-11e4-ab6d-005056801329"
    }
  ])
});