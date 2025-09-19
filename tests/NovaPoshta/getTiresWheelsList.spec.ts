import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { tiresWheelsListResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Види шин і дисків NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  const result: tiresWheelsListResponse = await np.getTiresWheelsList();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Ref": "20f7b625-9add-11e3-b441-0050568002cf",
      "Description": "Шина вантажна R 22,5",
      "DescriptionRu": "Шина грузовая R 22,5",
      "Weight": "94.00",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "20f7b626-9add-11e3-b441-0050568002cf",
      "Description": "Шина вантажна R 17,5 ",
      "DescriptionRu": "Шина грузовая R 17,5",
      "Weight": "35.00",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "20f7b627-9add-11e3-b441-0050568002cf",
      "Description": "Шина вантажна R 19,5",
      "DescriptionRu": "Шина грузовая R 19,5",
      "Weight": "61.00",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "20f7b628-9add-11e3-b441-0050568002cf",
      "Description": "Шина вантажна R 20",
      "DescriptionRu": "Шина грузовая R 20",
      "Weight": "105.00",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456c5-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Шина легкова R 13-14",
      "DescriptionRu": "Шина легковая R 13-14",
      "Weight": "14.90",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456c6-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Шина легкова R 15-17",
      "DescriptionRu": "Шина легковая R 15-17",
      "Weight": "23.09",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456c7-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Шина легкова R 18-19",
      "DescriptionRu": "Шина легковая R 18-19",
      "Weight": "29.48",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456c8-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Шина легкова R 20-21",
      "DescriptionRu": "Шина легковая R 20-21",
      "Weight": "34.77",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456c9-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Шина легкова R 23",
      "DescriptionRu": "Шина легковая R 23",
      "Weight": "43.32",
      "DescriptionType": "Tires"
    },
    {
      "Ref": "d7c456ca-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск вантажний R 17,5 ",
      "DescriptionRu": "Диск грузовой R 17,5",
      "Weight": "28.00",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456cb-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск вантажний R 19,5",
      "DescriptionRu": "Диск грузовой R 19,5",
      "Weight": "45.00",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456cc-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск вантажний R 20",
      "DescriptionRu": "Диск грузовой R 20",
      "Weight": "80.00",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456cd-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск вантажний R 22,5",
      "DescriptionRu": "Диск грузовой R 22,5",
      "Weight": "70.00",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456cf-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск легковий R 13-14",
      "DescriptionRu": "Диск легковой R 13-14",
      "Weight": "8.75",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456d0-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск легковий R 15-17",
      "DescriptionRu": "Диск легковой R 15-17",
      "Weight": "15.42",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456d1-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск легковий R 18-19",
      "DescriptionRu": "Диск легковой R 18-19",
      "Weight": "23.75",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456d2-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск легковий R 20-21",
      "DescriptionRu": "Диск легковой R 20-21",
      "Weight": "40.00",
      "DescriptionType": "Wheels"
    },
    {
      "Ref": "d7c456d3-aa8b-11e3-9fa0-0050568002cf",
      "Description": "Диск легковий R 23",
      "DescriptionRu": "Диск легковой R 23",
      "Weight": "52.50",
      "DescriptionType": "Wheels"
    }
  ])
});