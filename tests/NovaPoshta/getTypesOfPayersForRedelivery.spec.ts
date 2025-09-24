import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { cargoTypesResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Види платників зворотної доставки NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const result: cargoTypesResponse = await np.getTypesOfPayersForRedelivery();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Description": "Відправник",
      "Ref": "Sender"
    },
    {
      "Description": "Одержувач",
      "Ref": "Recipient"
    },
    {
      "Description": "Третя особа",
      "Ref": "ThirdPerson"
    }
  ])
});