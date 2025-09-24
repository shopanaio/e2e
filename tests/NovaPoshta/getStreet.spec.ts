import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { streetProperties, streetResponse } from '../../fixtures/novaposhta/NovaPoshta.types';
//import { expectReferenceDictionary } from '@fixtures/novaposhta/expectReferenceDictionary';

test('Довідник вулиць компанії NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const methodProperties: streetProperties = {
    CityRef: "db5c88d0-391c-11dd-90d9-001a92567626",
    
  };

  const result: streetResponse = await np.getStreet(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */
  expect(result.data).toEqual(
    expect.arrayContaining([
      {
        Description: '18-а',
        Ref: '59e0b106-49a2-11dd-9198-001d60451983',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      },
      {
        Description: '18-а  6-ї станції Люстдорфської дороги',
        Ref: 'aaf7572b-c35d-11e6-8b12-005056887b8d',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      },
      {
        Description: '19-а',
        Ref: '30062930-49a2-11dd-9198-001d60451983',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      },
      {
        Description: '2-а',
        Ref: 'bc9ff6fb-4161-11dd-9198-001d60451983',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      },
      {
        Description: '2-а 6-ої Станції Люстдорфської дороги',
        Ref: '72fb6579-d212-11e4-a77a-005056887b8d',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      },
      {
        Description: '2-а Марії Демченко',
        Ref: '85cf8862-54bc-11e6-a9f2-005056887b8d',
        StreetsTypeRef: 'Line',
        StreetsType: 'лінія'
      }
    ])
  );
});