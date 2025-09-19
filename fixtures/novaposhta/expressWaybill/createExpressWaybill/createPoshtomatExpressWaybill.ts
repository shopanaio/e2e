/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/0227072e-8f38-11ec-8ced-005056b2dbe1 */

import { ServiceType, CreateWaybillPoshtomatResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod, createPoshtomatMethodProperties } from "@fixtures/novaposhta/NovaPoshta.types";
import { request } from '@playwright/test';

/* Обмеження:

Поштомат може бути лише відділенням одержувача;
Відправляти на поштамат можна тільки типи вантажу Посилка(Parcel) та Документи(Documents);
Максимальне значення оцінної вартості для відправки на поштомат(параметр Cost) – 10000 грн.;
Максимально допустимі габарити вантажу: Ширина 40 см; Довжина 60 см; Висота 30 см;
Максимально допустима вага вантажу 20 кг;
При створенні відправлення на поштомат можна вказувати лише одне місце на одне відправлення. */

interface expressPoshtomatWaybillData {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.Save;
  methodProperties: createPoshtomatMethodProperties
}

const createPoshtomatExpressWaybillData: expressPoshtomatWaybillData = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.Save,
  methodProperties: {
    SenderWarehouseIndex: "101/102",
    RecipientWarehouseIndex: "11/3002",
    PayerType: "Sender",
    PaymentMethod: "Cash",
    DateTime: "дд.мм.рррр",
    CargoType: "Cargo",
    Weight: "0.5",
    ServiceType: ServiceType.DoorsWarehouse,
    SeatsAmount: "2",
    Description: "Додатковий опис відправлення",
    Cost: "6000",
    CitySender: "00000000-0000-0000-0000-000000000000",
    Sender: "00000000-0000-0000-0000-000000000000",
    SenderAddress: "00000000-0000-0000-0000-000000000000",
    ContactSender: "00000000-0000-0000-0000-000000000000",
    SendersPhone: "380660000000",
    CityRecipient: "00000000-0000-0000-0000-000000000000",
    Recipient: "00000000-0000-0000-0000-000000000000",
    RecipientAddress: "00000000-0000-0000-0000-000000000000",
    ContactRecipient: "00000000-0000-0000-0000-000000000000",
    RecipientsPhone: "380660000000",
    OptionsSeat: [
      {
        volumetricVolume: "1",
        volumetricWidth: "30",
        volumetricLength: "30",
        volumetricHeight: "30",
        weight: "20"
      }
    ]
  }
}

async function createPoshtomatExpressWaybill(
  requestData: expressPoshtomatWaybillData
): Promise<CreateWaybillPoshtomatResponse> {
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

    const result: CreateWaybillPoshtomatResponse = await response.json();

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
  const createPoshtomatResult = await createPoshtomatExpressWaybill(createPoshtomatExpressWaybillData);

  if (createPoshtomatResult.success && createPoshtomatResult.data.length > 0) {
    const waybill = createPoshtomatResult.data[0];
    console.log("Накладна створена успішно!");
    console.log("Номер ЕН:", waybill.IntDocNumber);
    console.log("Дата доставки:", waybill.EstimatedDeliveryDate);
    console.log("Вартість:", waybill.CostOnSite);
  } else {
    console.warn("Помилка при створенні накладної:", createPoshtomatResult.errors);
  }
})();