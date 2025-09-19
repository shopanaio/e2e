import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { searchSettlementsProperties, searchSettlementsResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Онлайн пошук в довіднику населених пунктів NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  const methodProperties: searchSettlementsProperties = {
    /* не обязательно вводить полное название города */
    CityName: "київ",
    /* ограничивает количество объектов в result.data[0].Addresses */
    Limit: "50",
    Page: "1"
  };

  const result: searchSettlementsResponse = await np.searchSettlements(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result.data[0].Addresses.length) */

  expect(result.data).toEqual([
    {
      "TotalCount": 9,
      "Addresses": [
        {
          "Present": "м. Київ, Київська обл.",
          "Warehouses": 10091,
          "MainDescription": "Київ",
          "Area": "Київська",
          "Region": "",
          "SettlementTypeCode": "м.",
          "Ref": "e718a680-4b33-11e4-ab6d-005056801329",
          "DeliveryCity": "8d5a980d-391c-11dd-90d9-001a92567626",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": true,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "",
          "RegionTypesCode": ""
        },
        {
          "Present": "с. Київець, Миколаївський р-н, Львівська обл.",
          "Warehouses": 2,
          "MainDescription": "Київець",
          "Area": "Львівська",
          "Region": "Миколаївський",
          "SettlementTypeCode": "с.",
          "Ref": "0df25497-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "6dbe5985-96d1-11ea-a970-b8830365ade4",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київ, Вознесенський р-н, Миколаївська обл.",
          "Warehouses": 0,
          "MainDescription": "Київ",
          "Area": "Миколаївська",
          "Region": "Вознесенський",
          "SettlementTypeCode": "с.",
          "Ref": "0db2df4b-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "06f8795a-4079-11de-b509-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київка, Голопристанський р-н, Херсонська обл.",
          "Warehouses": 0,
          "MainDescription": "Київка",
          "Area": "Херсонська",
          "Region": "Голопристанський",
          "SettlementTypeCode": "с.",
          "Ref": "0dd153b3-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "fd249301-887a-11e9-898c-005056b24375",
          "AddressDeliveryAllowed": false,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київське, Новомиколаївський р-н, Запорізька обл.",
          "Warehouses": 0,
          "MainDescription": "Київське",
          "Area": "Запорізька",
          "Region": "Новомиколаївський",
          "SettlementTypeCode": "с.",
          "Ref": "0e40bf5a-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "cfbeaca4-4063-11de-b509-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київське, Баштанський р-н, Миколаївська обл.",
          "Warehouses": 0,
          "MainDescription": "Київське",
          "Area": "Миколаївська",
          "Region": "Баштанський",
          "SettlementTypeCode": "с.",
          "Ref": "0d94f546-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "000655dc-4079-11de-b509-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київське, Новоодеський р-н, Миколаївська обл.",
          "Warehouses": 0,
          "MainDescription": "Київське",
          "Area": "Миколаївська",
          "Region": "Новоодеський",
          "SettlementTypeCode": "с.",
          "Ref": "0dc2dec1-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "000655d8-4079-11de-b509-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київське, Гадяцький р-н, Полтавська обл.",
          "Warehouses": 0,
          "MainDescription": "Київське",
          "Area": "Полтавська",
          "Region": "Гадяцький",
          "SettlementTypeCode": "с.",
          "Ref": "0e1c492c-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "7833e610-3b51-11de-913b-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        },
        {
          "Present": "с. Київське, Синельниківський р-н, Дніпропетровська обл.",
          "Warehouses": 0,
          "MainDescription": "Київське",
          "Area": "Дніпропетровська",
          "Region": "Синельниківський",
          "SettlementTypeCode": "с.",
          "Ref": "0e117408-4b3a-11e4-ab6d-005056801329",
          "DeliveryCity": "69da419c-3f5d-11de-b509-001d92f78698",
          "AddressDeliveryAllowed": true,
          "StreetsAvailability": false,
          "ParentRegionTypes": "область",
          "ParentRegionCode": "обл.",
          "RegionTypes": "район",
          "RegionTypesCode": "р-н"
        }
      ]
    }
  ])
});