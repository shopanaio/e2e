import type {
  trackMethodProperties,
  TrackResponse,
  createMethodProperties,
  CreateWaybillResponse,
  updateMethodProperties,
  updateResponse,
  deleteMethodProp,
  deleteResponse,
  MethodPropertiesDeliveryDate,
  DeliveryDateResponse,
  MethodPropertiesWithOptions,
  WaybillWithOptionsResponse,
  PriceMethodProperties,
  priceResponse,
  createPoshtomatMethodProperties,
  CreateWaybillPoshtomatResponse,
  cargoTypesResponse,
  timeIntervalsProperties,
  timeIntervalsResponse,
  palletsListResponse,
  packListProperties,
  packListResponse,
  tiresWheelsListResponse,
  cargoDescriptionListResponse,
  messageCodeTextResponse,
  serviceTypesResponse,
  ownershipFormsListResponse,
  pickupTimeIntervalsProperties,
  pickupTimeIntervalsResponse,

  settlementsProperties,
  settlementsResponse,
  settlementsCountryRegionProperties,
  settlementsCountryRegionResponse,
  citiesProperties,
  citiesResponse,
  streetProperties,
  streetResponse,

  searchSettlementsProperties,
  searchSettlementsResponse,

  searchSettlementStreetsProperties,
  searchSettlementStreetsResponse,
} from './NovaPoshta.types';
import { request } from '@playwright/test';

export class NovaPoshta {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(modelName: string, calledMethod: string, methodProperties: any): Promise<T> {
    const context = await request.newContext();
    try {
      const response = await context.post("https://api.novaposhta.ua/v2.0/json/", {
        data: {
          apiKey: this.apiKey,
          modelName,
          calledMethod,
          methodProperties,
        },
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok()) throw new Error(`HTTP error! Status: ${response.status()}`);
      const result = await response.json();
      if (!result.success) throw new Error(`API error: ${result.errors}`);
      return result;
    } finally {
      await context.dispose();
    }
  }

  /* Метод створення експресс накладної */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a965630e-8512-11ec-8ced-005056b2dbe1 */
  /* Метод «save», працює в моделі «InternetDocument», цей метод дозволяє створювати/формувати експрес-накладну (інтернет-документ).
Якщо вибрано тип доставки "CargoType": "Documents", доступні такі параметри ваги: 0,1 або 0,5 або 1. У всіх інших випадках повернеться помилка.
У цьому запиті можливе вказівку зворотної доставки. Достатньо вказати параметр методу «BackwardDeliveryData». Більш детально переглянути різні варіанти зворотної доставки можна у розділі Створити ЕН зі зворотною доставкою.
Можливий варіант створення експрес-накладної з оплатою від "Третьої особи", у такому разі необхідно замінити параметр «PayerType» на:
"PayerType": "ThirdPerson",
"ThirdPerson": "5953fb16-08d8-11e4-8958-0025909b4e33",
Для платника ThirdPerson форма оплати може бути лише "Безготівковий розрахунок"
Після створення інтернет документа в програмному середовищі API, ЕН з'являється у списку ЕН в особистому кабінеті.  */
  async createExpressWaybill(props: createMethodProperties) {
    return this.request<CreateWaybillResponse>("InternetDocumentGeneral", "save", props);
  }

  /* Метод оновлення експресс накладної */
  async updateExpressWaybill(props: updateMethodProperties) {
    return this.request<updateResponse>("InternetDocumentGeneral", "update", props);
  }

  /* Необхідний для видалення експрес-накладної (інтернет-документа) */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a9f43ff1-8512-11ec-8ced-005056b2dbe1 */
  async deleteWaybill(props: deleteMethodProp) {
    return this.request<deleteResponse>("InternetDocumentGeneral", "delete", props);
  }

  /* Метод отримання орієнтовної дати прибуття експресс накладної */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a941c714-8512-11ec-8ced-005056b2dbe1 */
  async getDeliveryDate(props: MethodPropertiesDeliveryDate) {
    return this.request<DeliveryDateResponse>("InternetDocumentGeneral", "getDocumentDeliveryDate", props);
  }

  /* Метод розрахунку вартості доставки */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a91f115b-8512-11ec-8ced-005056b2dbe1 */
  /* Метод «getDocumentPrice», працює в моделі «InternetDocument», цей метод дозволяє розрахувати вартості доставки вантажу.

Метод дозволять прораховувати не тільки відправлення вантажів, але і шин та дисків, палет, а також документів.

Приклад прорахунку вартості Шин та Дисків:

"CargoType": "TiresWheels", // Тип відправлення Шини та Диски

"CargoDetails": [{//Масив з даними

"CargoDescription":"d7c456cf-aa8b-11e3-9fa0-0050568002cf", // Ідентифікатор типу відправлення Шина R-13, з довідника Види шин та дисків

"Amount": "2" //Кількість шин }]

Приклад розрахунку вартості вантажів з передачею параметрів:

"OptionsSeat": [{//Масив з даними

"weight": 5, // вага відправлення, кг

"volumetricWidth": 80, // ширина відправлення, см

"volumetricLength": 25, // довжина відправлення, см

"volumetricHeight": 25, // висота відправлення, см }]

Також доступний прорахунок вартості з урахуванням вартості упаковки із відповідного довідника "Види упаковки". Ідентифікатор упаковки необхідно передавати у масиві "OptionsSeat"

Приклад розрахунку вартості з пакуванням:

"OptionsSeat": [{//Масив з даними

"weight": 5, // вага відправлення, кг

"volumetricWidth": 80, // ширина відправлення, см

"volumetricLength": 25, // довжина відправлення, см

"volumetricHeight": 25, // висота відправлення, см

"packRef": "1499fa4a-d26e-11e1-95e4-0026b97ed48a" }], */
  async getDeliveryPrice(props: PriceMethodProperties) {
    return this.request<priceResponse>("InternetDocumentGeneral", "getDocumentPrice", props);
  }

  /* Метод вітстеження відправлення 
  надає можливість перегляду детальної інформації про статус відправлень. 
  Цей метод дозволяє користувачам отримати актуальні дані щодо статусу їх відправлень, 
  включаючи інформацію про відправника та одержувача.*/
  /* https://developers.novaposhta.ua/view/model/a99d2f28-8512-11ec-8ced-005056b2dbe1/method/a9ae7bc9-8512-11ec-8ced-005056b2dbe1 */
  async trackWaybill(props: trackMethodProperties) {
    return this.request<TrackResponse>("TrackingDocumentGeneral", "getStatusDocuments", props);
  }

  /* Метод створення експресс накладної з додатковими опціями */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/751067b8-9337-11ec-8ced-005056b2dbe1 */
  /* 1. Формування запиту на створення «ЕН» із послугою «Суботня доставка»
"SaturdayDelivery": "1", - суботня доставка "1" - ТАК "0" – НІ

2. Формування запиту створення «ЕН» з послугою «Контроль оплати»
"AfterpaymentOnGoodsCost": "1005",

3. Формування запиту на створення «ЕН» з послугою «Локал Експрес»
"LocalExpress": "1",
"TimeInterval": "CityDeliveryTimeInterval2", - доступні інтервали 2, 3, 4.
Якщо це значення порожнє, API проставить позначку "Протягом дня" Детальніше про часові інтервали можна ознайомитися у пункті 5 даного розділу. Послуга доступна лише в межах доставки в одному місті.

4. Формування запиту на створення «ЕН» з послугою «Дата доставки»*
(*послуга надається тільки якщо доставка до адреси)
"PreferredDeliveryDate": "07.03.2021",

5. Формування запиту на створення «ЕН» із послугою «Доставка в часові інтервали»*
(*послуга надається тільки якщо доставка до адреси)
"PreferredDeliveryDate": "25.03.2021",
"TimeInterval": "CityDeliveryTimeInterval1/2/3/4",
Послуга «Доставка в часові інтервали» можлива лише при замовленні послуги «Бажана дата доставки». Як завантажити список видів часових інтервалів можна побачити у «Види часових інтервалів».

6. Формування запиту на створення «ЕН» за допомогою послуги «Вказати номери упаковки»
"PackingNumber": "4545" - "4545" номер пакування.

7. Формування запиту на створення «ЕН» із послугою «Вказати внутрішній номер замовлення клієнта»
"InfoRegClientBarcodes": "121212", - "121212" внутрішній номер

8. Формування запиту на створення «ЕН» з описом «Супроводжуючі документи»
"AccompanyingDocuments" : "Договір";

9. Формування запиту на створення «ЕН» з описом «Додаткова інформація про відправлення»
"AdditionalInformation": "Смартфон";

10. Формування запиту на створення «ЕН» з послугою «До дверей»
"NumberOfFloorsLifting": "3", 3 - номер поверху

11. Формування запиту на створення «ЕН» з послугою «Від дверей»
"NumberOfFloorsDescent": "3", 3 - номер поверху
Параметр ліфт ("Elevator") при цьому можна ігнорувати.

12. Формування запиту на створення «ЕН» з додатковою послугою «Доставка особисто в руки»
"DeliveryByHand": "1", - "1" - ТАК "0" – НІ
"DeliveryByHandRecipients": [ - перелік одержувачів яким можна віддавати відправлення "Могилевська Юлія Костянтинівна", "Колесник Костянтин Олександрович" ],
Під час замовлення послуги можна завантажувати до 15 осіб включно. При цьому перша особа завжди – одержувач (підтягується з «Дані одержувача»), решта 14 (чотирнадцять) – довільні одержувачі.

13. Формування запиту на створення «ЕН» з послугою «Контроль поштучної передачі» (експедирування)
"ForwardingCount":"126" 126 - кількість штук

14. Формування запиту на створення «ЕН» із послугою «Red Box»
"RedBoxBarcode":"0105QD26L" 0105QD26L - код враховує лише верхній регістр

15. Формування запиту на створення «ЕН» з пакуванням
Доступно для технології доставки до відділення. Обрати пакування необхідно за допомогою методу getPackListSpecial:
Приклад: { "modelName": "Common",
"calledMethod": "getPackListSpecial",
"methodProperties": { "Length": 100, // довжина відпрвлення, мм
"Width": 500, // ширина відпрвлення, мм
"Height": 50, // висота відпрвлення, мм
"PackForSale": "1" } }

Ідентифікатор пакування, що повертається у відповіді необхідно передавати в масиві "OptionsSeat"
Пример: "OptionsSeat": [{ // Масив з даними
"weight": 5, // вага відпрвлення, кг
"volumetricWidth": 80, // ширина відпрвлення, см
"volumetricLength": 25, // довжина відпрвлення, см
"volumetricHeight": 25, // висота відпрвлення, см
"packRef": "1499fa4a-d26e-11e1-95e4-0026b97ed48a" }],

16. Формування запиту на створення «ЕН» з послугою «Ручне оброблення»

Послуга доступна до замовлення у разі створення документа з характеристиками: довжина відправлення (або одного місця) від 1 до 120 см, ширина та висота до 70 см та вагою (фактичною або об'ємною) відправлення (або одного місця) від 0,1 до 30 кг . Оформлення відправлень з категорією «Ручне оброблення» дозволено лише з/на вантажні відділення, пункти прийому-видачі та адресу. Замовлення послуги можливе лише з передачею габаритів місць з використанням параметра:
"specialCargo":"1", - «Ручне оброблення» "1" - ТАК "0" – НІ
"OptionsSeat": [ { // Масив з даними параметрів вантажу для кожного місця відправлення
"weight": 5, // вага місця, кг
"volumetricHeight":50, // висота місця, см
"volumetricWidth":10, // ширина місця, см
"volumetricLength": 10, / / Довжина місця, см
"cost": "1", // оцінна вартість місця, грн
"description": "1", "specialCargo":"1" }]

Після створення інтернет документу в прграмному середовищі АРІ, ЕН з'явиться в переліку ЕН в бізнес кабінеті. Відкрив документ побачимо обрану послугу або додане пакування. */
  async createWaybillWithOptions(props: MethodPropertiesWithOptions) {
    return this.request<WaybillWithOptionsResponse>("InternetDocumentGeneral", "save", props);
  }

  /* Створити експрес-накладну на поштомат */
  /* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/0227072e-8f38-11ec-8ced-005056b2dbe1 */
  /* При створенні ЕН на відділення типу поштамат обов'язково вказуються параметри розмірів.
Обмеження:
Поштомат може бути лише відділенням одержувача;
Відправляти на поштамат можна тільки типи вантажу Посилка (Parcel) та Документи (Documents);
Максимальне значення оцінної вартості для відправки на поштомат (параметр Cost) – 10000 грн.;
Максимально допустимі габарити вантажу: Ширина 40 см; Довжина 60 см; Висота 30 см;
Максимально допустима вага вантажу 20 кг;
При створенні відправлення на поштомат можна вказувати лише одне місце на одне відправлення.
Після створення інтернет документа в програмному середовищі API, ЕН з'являється у списку ЕН в особистому кабінеті.  */
  async createPoshtomatExpressWaybill(props: createPoshtomatMethodProperties) {
    return this.request<CreateWaybillPoshtomatResponse>("InternetDocumentGeneral", "save", props);
  }

  /* Получение типов грузов (getCargoTypes) */
  /* Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a5912a1e-8512-11ec-8ced-005056b2dbe1 */
  async getCargoTypes() {
    return this.request<cargoTypesResponse>(
      "CommonGeneral",
      "getCargoTypes",
      {} // methodProperties пустой объект
    );
  }

  /* Види зворотної доставки вантажу*/
  /* Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a5b46873-8512-11ec-8ced-005056b2dbe1 */
  async backwardDelivery() {
    return this.request<cargoTypesResponse>(
      "CommonGeneral",
      "getBackwardDeliveryCargoTypes",
      {} // methodProperties пустой объект
    );
  }

  /* Види часових інтервалів 
  метод необхідний для отримання списку часових інтервалів (для замовлення послуги «Часові інтервали»). 
  Для оновлення даних, довідник потрібно завантажувати один раз на місяць.*/
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a56d5c1c-8512-11ec-8ced-005056b2dbe1 */
  async getTimeIntervals(props: timeIntervalsProperties) {
    return this.request<timeIntervalsResponse>(
      "CommonGeneral",
      "getTimeIntervals",
      props // необхіден Ідентифікатор міста для якого будуть отримані часові інтервали
    );
  }

  /* Види палет */
  /* Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a5dd575e-8512-11ec-8ced-005056b2dbe1 */
  async getPalletsList() {
    return this.request<palletsListResponse>(
      "CommonGeneral",
      "getPalletsList",
      {} // methodProperties пустой объект
    );
  }

  /* Види платників зворотної доставки */
  /* Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a6247f2f-8512-11ec-8ced-005056b2dbe1 */
  async getTypesOfPayersForRedelivery() {
    return this.request<cargoTypesResponse>(
      "CommonGeneral",
      "getTypesOfPayersForRedelivery",
      {} // methodProperties пустой объект
    );
  }

  /* Види упаковки */
  /* Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a6492db4-8512-11ec-8ced-005056b2dbe1 */
  async getPackList(props: packListProperties) {
    return this.request<packListResponse>(
      "CommonGeneral",
      "getPackList",
      props
    );
  }

  /* Види шин і дисків */
  /* метод дозволяє завантажити список шин і дисків (використовується, якщо вид вантажу шини-диски) українською та російською мовами.
  Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані.
  Рекомендується проводити оновлення довідників раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a66fada0-8512-11ec-8ced-005056b2dbe1 */
  async getTiresWheelsList() {
    return this.request<tiresWheelsListResponse>(
      "CommonGeneral",
      "getTiresWheelsList",
      {} // methodProperties пустой объект
    )
  }



  /* Описи вантажу */
  /* метод дозволяє віддати опис вантажу українською та російською мовами. "FindByString": "абажур", - також доступний пошук по рядках, не обов'язковий параметр.
Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані.
Рекомендується проводити оновлення довідників раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a697db47-8512-11ec-8ced-005056b2dbe1 */
  async getCargoDescriptionList() {
    return this.request<cargoDescriptionListResponse>(
      "CommonGeneral",
      "getCargoDescriptionList",
      {} // methodProperties пустой объект
    )
  }

  /* Перелік помилок */
  /* метод необхідний для завантаження довідника з описом переліку помилок.
  Метод постійно поповнюється новим описом трьома мовами.
  Для оновлення даних, довідник потрібно завантажувати один раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a6bce5a1-8512-11ec-8ced-005056b2dbe1 */
  async getMessageCodeText() {
    return this.request<messageCodeTextResponse>(
      "CommonGeneral",
      "getMessageCodeText",
      {} // methodProperties пустой объект
    )
  }
  /* Технології доставки */
  /* метод дозволяє завантажити список типів технологій доставки: «склад-склад», «двері-двері», «склад-двері», «двері-склад» українською та російською мовами.
  Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані.
  Рекомендується оновлювати раз на місяць.*/
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a6e189f7-8512-11ec-8ced-005056b2dbe1 */
  async getServiceTypes() {
    return this.request<serviceTypesResponse>(
      "CommonGeneral",
      "getServiceTypes",
      {} // methodProperties пустой объект
    )
  }

  /* Форми власності */
  /* дозволяє завантажити список форм власності українською мовою.
  Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані.
  Рекомендується оновлювати раз на місяць. */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/a754ff0d-8512-11ec-8ced-005056b2dbe1 */
  async getOwnershipFormsList() {
    return this.request<ownershipFormsListResponse>(
      "CommonGeneral",
      "getOwnershipFormsList",
      {} // methodProperties пустой объект
    )
  }

  /* Отримання доступних часових інтервалів для виклику кур’єра */
  /* дозволяє отримати доступні для вибору часові інтервали для візиту кур'єра */
  /* https://developers.novaposhta.ua/view/model/a55b2c64-8512-11ec-8ced-005056b2dbe1/method/c4389a2c-eaaf-11ef-84e0-48df37b921da */
  async getPickupTimeIntervals(props: pickupTimeIntervalsProperties) {
    return this.request<pickupTimeIntervalsResponse>(
      "CommonGeneral",
      "getPickupTimeIntervals",
      props // передается обязательный объект {город, дата}
    )
  }


  /* --- Адреси --- */

  /* Довідник областей населених пунктів */
  /* Метод дозволяє отримати довідник облестей населених пунктів */
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/c0bfb1a3-2a73-11ee-a60f-48df37b921db */
  async getSettlements(props: settlementsProperties) {
    return this.request<settlementsResponse>(
      "AddressGeneral",
      "getSettlementAreas",
      props // необязательный
    )
  }

  /* Довідник районів областей населених пунктів 
  Можна отримати довідник районів облестей населених пунктів*/
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/a98072f9-2a78-11ee-a60f-48df37b921db */
  async getSettlementCountryRegion(props: settlementsCountryRegionProperties) {
    return this.request<settlementsCountryRegionResponse>(
      "AddressGeneral",
      "getSettlementCountryRegion",
      props
    )
  }
  /* Довідник міст компанії */
  /* Довідник вивантажується тільки з населеними пунктами, де є відділення "Нова Пошта"
  і можна оформити доставку на відділення або за адресою.
  Якщо до запиту додати параметр «FindByString» та прописати назву населеного пункту 
  (Бровари), який потрібно знайти, то отримаємо запит за допомогою якого в довіднику знаходиться населений пункт.
  
  "methodProperties": { "FindByString": "Бровари" }
  
  Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. 
  Рекомендується оновлювати довідник раз на день. */
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/a1e6f0a7-8512-11ec-8ced-005056b2dbe1?_lang=ua */
  async getCities(props: citiesProperties) {
    return this.request<citiesResponse>(
      "AddressGeneral",
      "getCities",
      props // якщо відправити порожній об'єкт - отримаємо список усіх віст України
    )
  }

  /* Довідник вулиць компанії
  довідник вулиць в рамках населених пунктів України куди здійснєю доставку компанія НП*/
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/a98072f9-2a78-11ee-a60f-48df37b921db */
  async getStreet(props: streetProperties) {
    return this.request<streetResponse>(
      "AddressGeneral",
      "getStreet",
      props // об'овязково ідентифікатор міста та назва
    )
  }

  /* --- Online Search --- */

  /* Онлайн пошук в довіднику населених пунктів
  метод необхідний для ОНЛАЙН ПОШУКУ населених пунктів. */
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/a0eb83ab-8512-11ec-8ced-005056b2dbe1 */
  async searchSettlements(props: searchSettlementsProperties) {
    return this.request<searchSettlementsResponse>(
      "AddressGeneral",
      "searchSettlements",
      props  // фактически поиск по названию города
    )
  }

  /* Онлайн пошук вулиць в довіднику населених пунктів
  цей метод необхідний для ОНЛАЙН ПОШУКУ вулиць в обраному населеному пункті.*/
  /* https://developers.novaposhta.ua/view/model/a0cf0f5f-8512-11ec-8ced-005056b2dbe1/method/a1329635-8512-11ec-8ced-005056b2dbe1 */
  async searchSettlementStreets(props: searchSettlementStreetsProperties) {
    return this.request<searchSettlementStreetsResponse>(
      "AddressGeneral",
      "searchSettlementStreets",
      props // сначала необходимо получитьт Ref населенного пункта и использовать в этом запросе
    )
  }
}