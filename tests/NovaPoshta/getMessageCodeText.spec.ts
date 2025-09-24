import { test, expect } from '@playwright/test';
import { NovaPoshta } from '../../fixtures/novaposhta/NovaPoshta';
import { messageCodeTextResponse } from '../../fixtures/novaposhta/NovaPoshta.types';

test('Перелік помилок NovaPoshta', async () => {
  const apiKey = ''; 
  const np = new NovaPoshta(apiKey);

  const result: messageCodeTextResponse = await np.getMessageCodeText();

  expect(result.success).toBeTruthy();
  expect(result.data.length).toBeGreaterThan(0);

  /* console.log(result) */

  expect(result.data).toEqual(
    expect.arrayContaining([{
      MessageCode: '20000200095',
      MessageText: 'CargoDetails CargoDescription is incorrect',
      MessageDescriptionRU: 'Неправильно вказано значення Опис вантажу',
      MessageDescriptionUA: 'Неправильно вказано значення Опис вантажу'
    },
    {
      MessageCode: '20000200096',
      MessageText: 'CargoDetails count is invalid',
      MessageDescriptionRU: 'Значення Кількість недійсне',
      MessageDescriptionUA: 'Значення Кількість недійсне'
    },
    {
      MessageCode: '20000200097',
      MessageText: 'CargoDetails must be array',
      MessageDescriptionRU: 'Параметр Кількість повинен бути масивом',
      MessageDescriptionUA: 'Параметр Кількість повинен бути масивом'
    },
    {
      MessageCode: '20000200098',
      MessageText: 'CargoDetails must be empty',
      MessageDescriptionRU: 'Параметр Кількість повинен бути порожнім',
      MessageDescriptionUA: 'Параметр Кількість повинен бути порожнім'
    },
    {
      MessageCode: '20000200099',
      MessageText: 'CargoType not selected',
      MessageDescriptionRU: 'Тип вантажу не вибрано',
      MessageDescriptionUA: 'Тип вантажу не вибрано'
    },
    {
      MessageCode: '20000200101',
      MessageText: 'Certificate',
      MessageDescriptionRU: 'Сертифікат',
      MessageDescriptionUA: 'Сертифікат'
    },
    {
      MessageCode: '20000200102',
      MessageText: 'CityRecipient incorrect',
      MessageDescriptionRU: 'Місто отримувача вказано некоректно',
      MessageDescriptionUA: 'Місто отримувача вказано некоректно'
    },
    {
      MessageCode: '20000200103',
      MessageText: 'CityRecipient not found',
      MessageDescriptionRU: 'Місто отримувача не знайдено',
      MessageDescriptionUA: 'Місто отримувача не знайдено'
    },
    {
      MessageCode: '20000200104',
      MessageText: 'CityRecipient not selected',
      MessageDescriptionRU: 'Місто отримувача не обрано',
      MessageDescriptionUA: 'Місто отримувача не обрано'
    },
    {
      MessageCode: '20000200105',
      MessageText: 'CitySender is incorrect',
      MessageDescriptionRU: 'Місто відправника некоректне',
      MessageDescriptionUA: 'Місто відправника некоректне'
    }]))
});