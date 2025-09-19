import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { timeIntervalsProperties, timeIntervalsResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Види часових інтервалів NovaPoshta', async () => {
  const apiKey = ''; // ключ не нужен
  const np = new NovaPoshta(apiKey);

  const methodProperties: timeIntervalsProperties = {
    RecipientCityRef: "00000000-0000-0000-0000-000000000000",
  };

  const result: timeIntervalsResponse = await np.getTimeIntervals(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Number": "CityDeliveryTimeInterval1",
      "Start": "09:00",
      "End": "12:00"
    },
    {
      "Number": "CityDeliveryTimeInterval2",
      "Start": "12:00",
      "End": "15:00"
    },
    {
      "Number": "CityDeliveryTimeInterval3",
      "Start": "15:00",
      "End": "18:00"
    },
    {
      "Number": "CityDeliveryTimeInterval5",
      "Start": "09:00",
      "End": "18:00"
    }
  ])
});