import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { pickupTimeIntervalsResponse, pickupTimeIntervalsProperties } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Отримання доступних часових інтервалів для виклику кур’єра NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const methodProperties: pickupTimeIntervalsProperties = {
    "SenderCityRef": "00000000-0000-0000-0000-000000000000",
    "DateTime": "29.12.2025"
  };

  const result: pickupTimeIntervalsResponse = await np.getPickupTimeIntervals(methodProperties);

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual([
    {
      "Number": "CityPickingTimeInterval1",
      "Start": "09:00",
      "End": "15:00",
      "BoundaryTime": "12:00"
    },
    {
      "Number": "CityPickingTimeInterval2",
      "Start": "15:00",
      "End": "18:00",
      "BoundaryTime": "15:00"
    },
    {
      "Number": "CityPickingTimeInterval3",
      "Start": "09:00",
      "End": "18:00",
      "BoundaryTime": "16:00"
    }
  ])
});