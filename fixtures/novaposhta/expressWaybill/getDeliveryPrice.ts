/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a91f115b-8512-11ec-8ced-005056b2dbe1 */

import { priceResponse, PriceMethodProperties, NovaPoshtaModelName, NovaPoshtaCalledMethod } from "../NovaPoshta.types";

interface priceRequest {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.GetDocumentPrice;
  methodProperties: PriceMethodProperties;
}

const requestPriceData: priceRequest = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.GetDocumentPrice,
  methodProperties: {
    CitySender: "00000000-0000-0000-0000-000000000000",
    CityRecipient: "00000000-0000-0000-0000-000000000000",
    Weight: 5,
    ServiceType: "WarehouseWarehouse",
    Cost: "300",
    CargoType: "Cargo",
    SeatsAmount: "2",
    OptionsSeat: [
      {
        weight: "5",
        volumetricWidth: "80",
        volumetricLength: "25",
        volumetricHeight: "25",
        packRef: "1499fa4a-d26e-11e1-95e4-0026b97ed48a"
      }
    ],
    RedeliveryCalculate: {
      CargoType: "Money",
      Amount: "100"
    },
    PackCount: "1",
    PackRef: "1499fa4a-d26e-11e1-95e4-0026b97ed48a",
    Amount: "100",
    CargoDetails: [
      {
        CargoDescription: "00000000-0000-0000-0000-000000000000",
        Amount: "2"
      }
    ],
    CargoDescription: "00000000-0000-0000-0000-000000000000"
  }
};

async function getDocumentPrice(
  requestData: priceRequest
): Promise<priceResponse> {
  try {
    const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result: priceResponse = await response.json();

    if (!result.success) {
      console.error("Помилка з боку API:", result.errors);
    }

    return result;

  } catch (error) {
    console.error("Помилка запиту:", error);
    throw error;
  }
}

(async () => {
  const priceResult = await getDocumentPrice(requestPriceData);

  if (priceResult.success && priceResult.data.length > 0) {
    const price = priceResult.data[0].Cost;
    const zone = priceResult.data[0].TZoneInfo.TzoneName;

    console.log(`Вартість доставки: ${price} грн`);
    console.log(`Тарифна зона: ${zone}`);
  } else {
    console.warn("Розрахунок неуспішний або немає даних.");
  }
})()