/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a941c714-8512-11ec-8ced-005056b2dbe1 */

import { MethodPropertiesDeliveryDate, DeliveryDateResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod } from '../NovaPoshta.types';
import { request } from '@playwright/test';

interface DeliveryDateRequest {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.GetDocumentDeliveryDate;
  methodProperties: MethodPropertiesDeliveryDate;
}

const requestDeliveryDateData: DeliveryDateRequest = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.GetDocumentDeliveryDate,
  methodProperties: {
    DateTime: "2024-05-31 15:00:00",
    ServiceType: "WarehouseWarehouse",
    CitySender: "00000000-0000-0000-0000-000000000000",
    CityRecipient: "00000000-0000-0000-0000-000000000000"
  }
};

async function getDeliveryDate(requestData: DeliveryDateRequest): Promise<DeliveryDateResponse> {
  const context = await request.newContext();
  try {
    const response = await context.post("https://api.novaposhta.ua/v2.0/json/", {
      data: requestData,
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok()) {
      throw new Error(`HTTP error! Status: ${response.status()}`);
    }

    const result: DeliveryDateResponse = await response.json();

    if (!result.success) {
      console.error("Помилка з боку API:", result.errors);
    }

    return result;

  } catch (error) {
    console.error("Помилка запиту:", error);
    throw error;
  } finally {
    await context.dispose();
  }
}

(async () => {
  const dateResult = await getDeliveryDate(requestDeliveryDateData);

  if (dateResult.success && dateResult.data.length > 0) {
    const deliveryDate = dateResult.data[0].DeliveryDate.date;
    console.log("Очікувана дата доставки:", deliveryDate);
  } else {
    console.warn("Дата доставки не отримана", dateResult.errors);
  }
})();