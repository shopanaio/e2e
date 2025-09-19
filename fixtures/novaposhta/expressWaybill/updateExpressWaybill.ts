/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a98a4354-8512-11ec-8ced-005056b2dbe1 */

import { ServiceType, updateMethodProperties, updateResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod } from '../NovaPoshta.types';
import { request } from '@playwright/test';

interface update {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.Update;
  methodProperties: updateMethodProperties
}

const updateData: update = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.Update,
  methodProperties: {
    Ref: "00000000-0000-0000-0000-000000000000",
    PayerType: "ThirdPerson",
    PaymentMethod: "NonCash",
    DateTime: "дд.мм.рррр",
    CargoType: "Cargo",
    VolumeGeneral: "0.45",
    Weight: "0.5",
    ServiceType: ServiceType.DoorsWarehouse,
    SeatsAmount: "2",
    Description: "Додатковий опис відправлення",
    Cost: "15000",
    CitySender: "00000000-0000-0000-0000-000000000000",
    Sender: "00000000-0000-0000-0000-000000000000",
    SenderAddress: "00000000-0000-0000-0000-000000000000",
    ContactSender: "00000000-0000-0000-0000-000000000000",
    SendersPhone: "380660000000",
    CityRecipient: "00000000-0000-0000-0000-000000000000",
    Recipient: "00000000-0000-0000-0000-000000000000",
    RecipientAddress: "00000000-0000-0000-0000-000000000000",
    ContactRecipient: "00000000-0000-0000-0000-000000000000",
    RecipientsPhone: "380660000000"
  }
}

async function updateWaybill(
  requestData: update
): Promise<updateResponse> {
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

    const result: updateResponse = await response.json();

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
  const updateResult = await updateWaybill(updateData);

  if (updateResult.success && updateResult.data.length > 0) {
    const waybill = updateResult.data[0];
    console.log("Накладна оновлена успішно!");
    console.log("Номер ЕН:", waybill.IntDocNumber);
    console.log("Дата доставки:", waybill.EstimatedDeliveryDate);
    console.log("Вартість:", waybill.CostOnSite);
  } else {
    console.warn("Помилка при оновлені накладної:", updateResult.errors);
  }
})();