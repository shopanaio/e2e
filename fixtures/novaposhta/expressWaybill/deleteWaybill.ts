/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a9f43ff1-8512-11ec-8ced-005056b2dbe1 */

import { deleteMethodProp, deleteResponse, NovaPoshtaModelName, NovaPoshtaCalledMethod } from '../NovaPoshta.types';
import { request } from '@playwright/test';

interface deleteDataType {
  apiKey: string;
  modelName: NovaPoshtaModelName.InternetDocumentGeneral;
  calledMethod: NovaPoshtaCalledMethod.Delete;
  methodProperties: deleteMethodProp;
}

const deleteWaybillData: deleteDataType = {
  apiKey: "[ВАШ КЛЮЧ]",
  modelName: NovaPoshtaModelName.InternetDocumentGeneral,
  calledMethod: NovaPoshtaCalledMethod.Delete,
  methodProperties: {
    DocumentRefs: "00000000-0000-0000-0000-000000000000"
  }
}

async function deleteWaybill(
  requestData: deleteDataType
): Promise<deleteResponse> {
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

    const result: deleteResponse = await response.json();

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
  const deleteResult = await deleteWaybill(deleteWaybillData);

  if (deleteResult.success && deleteResult.data.length > 0) {
    const waybill = deleteResult.data[0];
    console.log("Накладна створена успішно!");
    console.log("Ідентифікатор документу:", waybill.Ref);;
  } else {
    console.warn("Помилка при створенні накладної:", deleteResult.errors);
  }
})()