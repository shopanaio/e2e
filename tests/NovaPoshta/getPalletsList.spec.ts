import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { palletsListResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Види палет NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);


  const result: palletsListResponse = await np.getPalletsList();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /*   console.log(result) */

  expect(result.data).toEqual([
    {
      "Ref": "627b0c23-d110-11dd-8c0d-001d92f78697",
      "Description": "Палета від 1,5 м2 до 2 м2 (816)",
      "DescriptionRu": "Паллета от 1,5 м2 до 2 м2",
      "Weight": "816.00"
    },
    {
      "Ref": "627b0c24-d110-11dd-8c0d-001d92f78697",
      "Description": "Палета від 1 м2 до 1,49 м2 (612)",
      "DescriptionRu": "Паллета от 1 м2 до 1,49 м2",
      "Weight": "612.00"
    },
    {
      "Ref": "627b0c25-d110-11dd-8c0d-001d92f78697",
      "Description": "Палета від 0,5 м2 до 0,99 м2 (408)",
      "DescriptionRu": "Паллета от 0,5 м2 до 0,99 м2",
      "Weight": "408.00"
    },
    {
      "Ref": "627b0c26-d110-11dd-8c0d-001d92f78697",
      "Description": "Палета до 0,49 м2 (204)",
      "DescriptionRu": "Паллета до 0,49 м2",
      "Weight": "204.00"
    }
  ])
});