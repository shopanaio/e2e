/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/751067b8-9337-11ec-8ced-005056b2dbe1 */

import { ServiceType, MethodPropertiesWithOptions, WaybillWithOptionsResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod } from '../../NovaPoshta.types';
import { request } from '@playwright/test';

interface waybillWithOptionsType {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.Save;
  methodProperties: MethodPropertiesWithOptions;
}


const waybillWithOptionsData: waybillWithOptionsType = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.Save,
  methodProperties: {
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
    RecipientsPhone: "380660000000",
    RedBoxBarcode: "",
    OptionsSeat: [
      {
        volumetricWidth: "30",
        volumetricLength: "30",
        volumetricHeight: "30",
        weight: "2",
        packRef: "1499fa4a-d26e-11e1-95e4-0026b97ed48a"
      }
    ]
  }
}


async function createWaybillWithOptions(
  requestData: waybillWithOptionsType
): Promise<WaybillWithOptionsResponse> {
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

    const result: WaybillWithOptionsResponse = await response.json();

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
  const createWithOptionsResult = await createWaybillWithOptions(waybillWithOptionsData);

  if (createWithOptionsResult.success && createWithOptionsResult.data.length > 0) {
    const waybill = createWithOptionsResult.data[0];
    console.log("Накладна створена успішно!");
    console.log("Номер ЕН:", waybill.IntDocNumber);
    console.log("Дата доставки:", waybill.EstimatedDeliveryDate);
    console.log("Вартість:", waybill.CostOnSite);
  } else {
    console.warn("Помилка при створенні накладної:", createWithOptionsResult.errors);
  }
})()