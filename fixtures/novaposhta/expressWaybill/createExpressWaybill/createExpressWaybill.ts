/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a965630e-8512-11ec-8ced-005056b2dbe1 */

import { createMethodProperties, CreateWaybillResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod, ServiceType } from '../../NovaPoshta.types';
import { request } from '@playwright/test';

interface expressWaybillData {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.Save;
  methodProperties: createMethodProperties
}

const createExpressWaybillData: expressWaybillData = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.Save,
  methodProperties: {
    SenderWarehouseIndex: "101/102",
    RecipientWarehouseIndex: "101/102",
    PayerType: "Sender",
    PaymentMethod: "Cash",
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

async function createExpressWaybill(
  requestData: expressWaybillData
): Promise<CreateWaybillResponse> {
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

    const result: CreateWaybillResponse = await response.json();

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
  const createResult = await createExpressWaybill(createExpressWaybillData);

  if (createResult.success && createResult.data.length > 0) {
    const waybill = createResult.data[0];
    console.log("Накладна створена успішно!");
    console.log("Номер ЕН:", waybill.IntDocNumber);
    console.log("Дата доставки:", waybill.EstimatedDeliveryDate);
    console.log("Вартість:", waybill.CostOnSite);
  } else {
    console.warn("Помилка при створенні накладної:", createResult.errors);
  }
})();