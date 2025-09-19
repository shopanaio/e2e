/* https://developers.novaposhta.ua/view/model/a99d2f28-8512-11ec-8ced-005056b2dbe1/method/a9ae7bc9-8512-11ec-8ced-005056b2dbe1 */

import { request } from '@playwright/test';
import { trackMethodProperties, TrackResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod } from '../NovaPoshta.types';

interface TrackWaybillData {
  apiKey: string;
  modelName: NovaPoshtaModelName.TrackingDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.GetStatusDocuments;
  methodProperties: trackMethodProperties;
}
/* {
  "apiKey": "",  // ключ не нужен, только номер посылки и один из двух номеров телефонов
  "modelName": "TrackingDocumentGeneral",
  "calledMethod": "getStatusDocuments",
  "methodProperties": {
"Documents" : [
{
"DocumentNumber":"20400048799000",
"Phone":"380600000000"
}
,
{
"DocumentNumber":"20400048799001",
"Phone":"380600000000"
}
]
  }
} */


const trackData: TrackWaybillData = {
  apiKey: "", // ключ не нужен, только номер посылки и один из двух номеров телефонов
  modelName: NovaPoshtaModelName.TrackingDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.GetStatusDocuments,
  methodProperties: {
    Documents: [
      {
        DocumentNumber: "20400048799001",
        Phone: "380600000000"
      }
    ]
  }
};


async function trackWaybills(data: TrackWaybillData): Promise<TrackResponse> {
  const context = await request.newContext();
  try {
    const response = await context.post("https://api.novaposhta.ua/v2.0/json/", {
      data,
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok()) {
      throw new Error(`HTTP error: ${response.status()}`);
    }

    const result: TrackResponse = await response.json();

    if (!result.success) {
      console.error("Ошибка со стороны API:", result.errors);
    }

    return result;

  } catch (error) {
    console.error("Ошибка при трекинге:", error);
    throw error;
  } finally {
    await context.dispose();
  }
}

(async () => {
  const response = await trackWaybills(trackData);

  if (response.success && response.data.length > 0) {
    for (const doc of response.data) {
      console.log("==============");
      console.log("Накладна:", doc.Number);
      console.log("Статус:", doc.Status);
      console.log("Дата создания:", doc.DateCreated);
      console.log("Города:", `${doc.CitySender} → ${doc.CityRecipient}`);
      console.log("Дата доставки:", doc.ActualDeliveryDate || "ещё не доставлено");
    }
  } else {
    console.warn("Не удалось получить статус накладных.");
  }
})();