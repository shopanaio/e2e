import {
  String36,
  String50,
  String100,
  ObjectRef
} from "./NovaPoshtaSupporting.types"
import { NovaPoshtaErrorCode } from "./NovaPoshtaErrorCode";

export interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
  warnings: string[];
  info: string[];
  messageCodes: string[];
  errorCodes: NovaPoshtaErrorCode[];
  warningCodes: string[];
  infoCodes: string[];
}

export enum NovaPoshtaModelName {
  TrackingDocumentGeneral = "TrackingDocumentGeneral",
  InternetDocumentGeneral = "InternetDocumentGeneral",
  CommonGeneral = "CommonGeneral",
}

export enum NovaPoshtaCalledMethod {
  GetStatusDocuments = "getStatusDocuments",
  Save = "save",
  Delete = "delete",
  Update = "update",
  GetDocumentDeliveryDate = "getDocumentDeliveryDate",
  GetDocumentPrice = "getDocumentPrice"
}

export enum PaymentMethod {
  Cash = "Cash",
  NonCash = "NonCash"
}

export enum CargoType {
  Parcel = "Parcel",
  Cargo = "Cargo",
  Documents = "Documents",
  TiresWheels = "TiresWheels",
  Pallet = "Pallet"
}

export enum ServiceType {
  /* Від дверей до дверей */
  DoorsDoors = "DoorsDoors",
  /* Від дверей до відділення */
  DoorsWarehouse = "DoorsWarehouse",
  /* Від відділення до відділення */
  WarehouseWarehouse = "WarehouseWarehouse",
  /* Від відділення до дверей */
  WarehouseDoors = "WarehouseDoors"
}

export enum PayerType {
  /* Выдправник */
  Sender = "Sender",
  /* Отримувач */
  Recipient = "Recipient",
  /* Третя особа */
  ThirdPerson = "ThirdPerson"
}

/* https://developers.novaposhta.ua/view/model/a99d2f28-8512-11ec-8ced-005056b2dbe1/method/a9ae7bc9-8512-11ec-8ced-005056b2dbe1 */
/* Метод «getStatusDocuments» у моделі «TrackingDocument» надає можливість перегляду детальної інформації про статус відправлень. 
Цей метод дозволяє користувачам отримати актуальні дані щодо статусу їх відправлень, включаючи інформацію про відправника та одержувача.
Основні можливості методу:

  - Отримання даних за номером телефону: При введенні номера телефону можна отримати інформацію про відправника та одержувача, включаючи їхні контактні дані.

  - Масовий перегляд відправлень: Метод дозволяє переглядати інформацію одночасно до 100 відправлень.

  - Актуальні статуси трекінгу: Метод відображає всі актуальні статуси трекінгу для кожного відправлення.

  - Доступність: Метод доступний як для авторизованих, так і для неавторизованих запитів.

Авторизований доступ, вимагає використання API-ключа:

  -  Для отримання повних даних про відправлення необхідно використовувати API-ключ.

  -  Отримання даних: У випадку успішної авторизації та валідації, повертаються коректні дані відправника та одержувача.

Неавторизований доступ, має обмежений доступ до даних:

  -  Для запитів без використання API-ключа застосовується логіка підміни даних.

  -  Логіка підміни: Дані відправника та одержувача замінюються на дані, що належать номеру телефону з запиту. */
export enum NovaPoshtaDeliveryStatus {
  /* Відправник самостійно створив цю накладну, але ще не надав до відправки */
  CreatedBySender = 1,
  /* Видалено */
  Deleted = 2,
  /* Номер не знайдено */
  NotFound = 3,
  /* Відправлення у місті ХХXХ. (межобласні відправлення) */
  InSenderCityInterregional = 4,
  /* Відправлення у місті ХХXХ. (локальні відправлення в межах міста) */
  InSenderCityLocal = 41,
  /* Відправлення прямує до міста YYYY */
  InTransitToRecipientCity = 5,
  /* Відправлення у місті YYYY, очікує на доставку */
  InRecipientCityAwaitingDelivery = 6,
  /* Прибув на відділення */
  ArrivedAtWarehouse = 7,
  /* Прибув на відділення (завантажено в Поштомат) */
  ArrivedAtPostomat = 8,
  /* Відправлення отримано */
  Received = 9,
  /* Відправлення отримано %DateReceived%. Очікуйте SMS про грошовий переказ */
  ReceivedAwaitingMoneyTransfer = 10,
  /* Відправлення отримано %DateReceived%. Грошовий переказ видано */
  ReceivedAndMoneyTransferred = 11,
  /* Нова Пошта комплектує ваше відправлення */
  BeingPacked = 12,
  /* На шляху до одержувача */
  OnTheWayToRecipient = 101,
  /* Відмова від отримання (створено замовлення на повернення) */
  RefusedByRecipientReturnCreated = 102,
  /* Відмова від отримання */
  RefusedByRecipient = 103,
  /* Змінено адресу */
  AddressChanged = 104,
  /* Припинено зберігання */
  StorageTerminated = 105,
  /* Одержано і створено ЄН зворотньої доставки */
  ReturnWaybillCreated = 106,
  /* Невдала спроба доставки через відсутність Одержувача */
  FailedDeliveryAttempt = 111,
  /* Дата доставки перенесена Одержувачем */
  DeliveryRescheduledByRecipient = 112
}

/* https://developers.novaposhta.ua/view/model/a99d2f28-8512-11ec-8ced-005056b2dbe1/method/a9ae7bc9-8512-11ec-8ced-005056b2dbe1 */
export interface trackMethodProperties {
  /* required
  Масив документів, який слід відстежити. У параметрі  DocumentNumber вказується номер документа, а в парметрі Phone номер телефону одержувача/відправника дозволяє отримати розширену інформацію
  example: "Documents" : [
    {
    "DocumentNumber":"20400048799000",
    "Phone":"380600000000"
    }
  ]*/
  Documents: {
    DocumentNumber: string;
    Phone?: string;
  }[];
}

export interface TrackStatusData {
  /* Доступність замовлення послуги повернення вантажу */
  PossibilityCreateReturn: boolean;
  /* Доступність замовлення послуги відмови від вантажу */
  PossibilityCreateRefusal: boolean;
  /* Доступність замовлення послуги внесення змін в ЕН */
  PossibilityChangeEW: boolean;
  /* Доступність замовлення послуги переадресування */
  PossibilityCreateRedirecting: boolean;
  /* Номер ЕН */
  Number: String36;
  /* Ідентифікатор зворотної доставки */
  Redelivery: String36;
  /* Сума зворотної доставки */
  RedeliverySum: String36;
  /* Номер зворотної доставки */
  RedeliveryNum: String36;
  /* Платник зворотної доставки */
  RedeliveryPayer: String36;
  /* Тип ЕН на підставі */
  OwnerDocumentType: String36;
  /* Останні зміни типу документу */
  LastCreatedOnTheBasisDocumentType: String36;
  /* Останні зміни, тип платника */
  LastCreatedOnTheBasisPayerType: String36;
  /* Останні зміни, дата створення */
  LastCreatedOnTheBasisDateTime: String36;
  /* Останній статус транзакції грошового переказу */
  LastTransactionStatusGM: String36;
  /* Останній час та дата транзакції грошового переказу */
  LastTransactionDateTimeGM: String36;
  /* Поточне значення суми грошового переказу */
  LastAmountTransferGM: String36;
  /* Дата створення ЕН */
  DateCreated: String36;
  /* Вага */
  DocumentWeight: String36;
  /* Фактична вага */
  FactualWeight: String36;
  /* Обʼємна вага */
  VolumeWeight: String36;
  /* Контрольне зважування */
  CheckWeight: String36;
  /* Метод контрольного зважування */
  CheckWeightMethod: String36;
  /* Вартість доставки */
  DocumentCost: String36;
  /* Розрахункова вага */
  CalculatedWeight: String36;
  /* Інформація до контрольного зважування */
  SumBeforeCheckWeight: String36;
  /* Платник */
  PayerType: PayerType;
  /* Отримувач (ПІБ) */
  RecipientFullName: String36;
  /* Дата отримання вантажу */
  RecipientDateTime: String36;
  /* Запланована дата доставки */
  ScheduledDeliveryDate: String36;
  /* Тип оплати */
  PaymentMethod: PaymentMethod;
  /* Опис вантажу */
  CargoDescriptionString: String36;
  /* Тип вантажу */
  CargoType: CargoType;
  /* Місто відправника */
  CitySender: String36;
  /* Місто отримувача */
  CityRecipient: String36;
  /* Відділення отримувача */
  WarehouseRecipient: String36;
  /* Тип контрагента */
  CounterpartyType: String36;
  /* Контроль оплати */
  AfterpaymentOnGoodsCost: String36;
  /* Тип доставки */
  ServiceType: String36;
  /* Причина нерозвозу */
  UndeliveryReasonsSubtypeDescription: String36;
  /* Номер відділення отримувача */
  WarehouseRecipientNumber: String36;
  /* Номер останньої створеної ЕН */
  LastCreatedOnTheBasisNumber: String36;
  /* Телефон отримувача */
  PhoneRecipient: String36;
  /* ПІБ отримувача з ЕН */
  RecipientFullNameEW: String36;
  /* REF складу отримувача */
  WarehouseRecipientInternetAddressRef: ObjectRef;
  /* Токен маркетплейсу */
  MarketplacePartnerToken: String36;
  /* Внутрішній номер замовлення */
  ClientBarcode: String36;
  /* Адреса отримувача */
  RecipientAddress: String36;
  /* Опис контрагента отримувача */
  CounterpartyRecipientDescription: String36;
  /* Дата сканування */
  DateScan: String36;
  /* Статус інтернет еквайрингу */
  PaymentStatus: String36;
  /* Дата оплати */
  PaymentStatusDate: String36;
  /* Сума до сплати */
  AmountToPay: String36;
  /* Сплачено */
  AmountPaid: String36;
  /* Статус */
  Status: String36;
  /* Код статусу */
  StatusCode: String36;
  /* REF ЕН */
  RefEW: ObjectRef;
  /* Зворотна доставка — дії */
  BackwardDeliverySubTypesActions: String36;
  /* Зворотна доставка — сервіси */
  BackwardDeliverySubTypesServices: String36;
  /* Причини нерозвозу */
  UndeliveryReasons: String36;
  /* Дата платного зберігання */
  DatePayedKeeping: String36;
  /* Тип міжнародної доставки */
  InternationalDeliveryType: String36;
  /* Кількість місць */
  SeatsAmount: String36;
  /* Замаскований номер карти */
  CardMaskedNumber: String36;
  /* Статус оплати ЕН */
  ExpressWaybillPaymentStatus: String36;
  /* Сума оплати ЕН */
  ExpressWaybillAmountToPay: String36;
  /* Телефон відправника */
  PhoneSender: String36;
  /* Дата оновлення трекінгу */
  TrackingUpdateDate: String36;
  /* Відділення відправника */
  WarehouseSender: String36;
  /* Дата повернення вантажу */
  DateReturnCargo: String36;
  /* Дата переміщення */
  DateMoving: String36;
  /* Дата першого дня зберігання */
  DateFirstDayStorage: String36;
  /* REF міста отримувача */
  RefCityRecipient: ObjectRef;
  /* REF міста відправника */
  RefCitySender: ObjectRef;
  /* REF населеного пункту отримувача */
  RefSettlementRecipient: ObjectRef;
  /* REF населеного пункту відправника */
  RefSettlementSender: ObjectRef;
  /* Адреса відправника */
  SenderAddress: String36;
  /* ПІБ відправника */
  SenderFullNameEW: String36;
  /* Оголошена вартість */
  AnnouncedPrice: String36;
  /* Додаткова інформація */
  AdditionalInformationEW: String36;
  /* Фактична дата доставки */
  ActualDeliveryDate: String36;
  /* Номер комірки поштомату */
  PostomatV3CellReservationNumber: String36;
  /* Номер документа-основи */
  OwnerDocumentNumber: String36;
  /* Сума комісії за грошовий переказ */
  LastAmountReceivedCommissionGM: String36;
  /* Часовий інтервал доставки */
  DeliveryTimeframe: String36;
  /* Створено на основі */
  CreatedOnTheBasis: String36;
  /* Дата причини нерозвозу */
  UndeliveryReasonsDate: String36;
  /* REF типу відділення одержувача */
  RecipientWarehouseTypeRef: ObjectRef;
  /* REF відділення одержувача */
  WarehouseRecipientRef: ObjectRef;
  /* Категорія відділення */
  CategoryOfWarehouse: String36;
  /* Адреса відділення отримувача */
  WarehouseRecipientAddress: String36;
  /* Інтернет адреса відділення відправника */
  WarehouseSenderInternetAddressRef: String36;
  /* Адреса відділення відправника */
  WarehouseSenderAddress: String36;
  /* Тип контрагента відправника */
  CounterpartySenderType: String36;
  /* Авіа доставка */
  AviaDelivery: String36;
  /* ШК RedBox */
  BarcodeRedBox: String36;
  /* Відмова від повернення */
  CargoReturnRefusal: String36;
  /* День зберігання вантажу */
  DaysStorageCargo: String36;
  /* Пакування */
  Packaging: unknown[] | null;
  /* Часткове повернення товару */
  PartialReturnGoods: unknown[] | null;
  /* Надійна покупка */
  SecurePayment: String36;
  /* Можливість зміни виплати на карту */
  PossibilityChangeCash2Card: boolean;
  /* Можливість зміни інтервалу доставки */
  PossibilityChangeDeliveryIntervals: boolean;
  /* Можливість подовження терміну зберігання */
  PossibilityTermExtensio: boolean;
  /* Кількість днів зберігання */
  StorageAmount: String36;
  /* Вартість зберігання */
  StoragePrice: String36;
  /* Безкоштовна доставка */
  FreeShipping: String36;
  /* Картка лояльності */
  LoyaltyCardRecipient: String36;
}

export type TrackResponse = NovaPoshtaResponse<TrackStatusData[]>;
/*const createResponse: TrackResponse = {
success: true,
data: [{
 PossibilityCreateReturn: true,
 PossibilityCreateRefusal: true,
 PossibilityChangeEW: true,
 PossibilityCreateRedirecting: true,
 Number: "20400048799000",
 Redelivery: "0",
 RedeliverySum: "0",
 RedeliveryNum: "",
 RedeliveryPayer: "Sender/Recipient",
 OwnerDocumentType: "",
 LastCreatedOnTheBasisDocumentType: "",
 LastCreatedOnTheBasisPayerType: "",
 LastCreatedOnTheBasisDateTime: "",
 LastTransactionStatusGM: "",
 LastTransactionDateTimeGM: "",
 LastAmountTransferGM: "",
 DateCreated: "18-11-2021 11:52:42",
 DocumentWeight: "3",
 FactualWeight: "3",
 VolumeWeight: "0.1",
 CheckWeight: "",
 CheckWeightMethod: "",
 DocumentCost: "51",
 CalculatedWeight: "3",
 SumBeforeCheckWeight: "",
 PayerType: "Sender",
 RecipientFullName: "ПІБ",
 RecipientDateTime: "21.11.2021 13:53:47",
 ScheduledDeliveryDate: "19.11.2021 13:53:47",
 PaymentMethod: "Cash",
 CargoDescriptionString: "Одяг",
 CargoType: "Cargo",
 CitySender: "Київ",
 CityRecipient: "Київ",
 WarehouseRecipient: "Відділення №101 (до 15 кг), Міні-відділення: вул. Велика Васильківська, 143/2, (маг. Фора)",
 CounterpartyType: "PrivatePerson",
 AfterpaymentOnGoodsCost: "0",
 ServiceType: "WarehouseWarehouse",
 UndeliveryReasonsSubtypeDescription: "",
 WarehouseRecipientNumber: "101",
 LastCreatedOnTheBasisNumber: "",
 PhoneRecipient: "380600000000",
 RecipientFullNameEW: "",
 WarehouseRecipientInternetAddressRef: "00000000-0000-0000-0000-000000000000",
 MarketplacePartnerToken: "",
 ClientBarcode: "",
 RecipientAddress: "м. Київ, Відділення №101 (до 15 кг), Міні-відділення, вул. Велика Васильківська, 143/2",
 CounterpartyRecipientDescription: "Приватна особа",
 CounterpartySenderType: "PrivatePerson",
 DateScan: "0001-01-01 00:00:00",
 PaymentStatus: "",
 PaymentStatusDate: "",
 AmountToPay: "",
 AmountPaid: "",
 Status: "",
 StatusCode: "",
 RefEW: "00000000-0000-0000-0000-000000000000",
 BackwardDeliverySubTypesActions: "",
 BackwardDeliverySubTypesServices: "",
 UndeliveryReasons: "",
 DatePayedKeeping: "",
 InternationalDeliveryType: "",
 SeatsAmount: "1",
 CardMaskedNumber: "",
 ExpressWaybillPaymentStatus: "PaymentNotAvailable",
 ExpressWaybillAmountToPay: "",
 PhoneSender: "",
 TrackingUpdateDate: "2022-06-07 13:42:56",
 WarehouseSender: "Отделение №178 (до 30 кг): просп. Оболонский, 35",
 DateReturnCargo: "",
 DateMoving: "",
 DateFirstDayStorage: "",
 RefCityRecipient: "00000000-0000-0000-0000-000000000000",
 RefCitySender: "00000000-0000-0000-0000-000000000000",
 RefSettlementRecipient: "00000000-0000-0000-0000-000000000000",
 RefSettlementSender: "00000000-0000-0000-0000-000000000000",
 SenderAddress: "м. Київ, Відділення №178 (до 30 кг): просп. Оболонський, 35",
 SenderFullNameEW: "Іванов Петро Миколайович",
 AnnouncedPrice: "50000",
 AdditionalInformationEW: "",
 ActualDeliveryDate: "",
 PostomatV3CellReservationNumber: "00000000-0000-0000-0000-000000000000",
 OwnerDocumentNumber: "",
 LastAmountReceivedCommissionGM: "",
 DeliveryTimeframe: "",
 CreatedOnTheBasis: "",
 UndeliveryReasonsDate: "",
 RecipientWarehouseTypeRef: "00000000-0000-0000-0000-000000000000",
 WarehouseRecipientRef: "00000000-0000-0000-0000-000000000000",
 CategoryOfWarehouse: "Branch",
 WarehouseRecipientAddress: "Киев, Героев Днепра, 53",
 WarehouseSenderInternetAddressRef: "00000000-0000-0000-0000-000000000000",
 WarehouseSenderAddress: "Киев, Оболонский, 35",
 AviaDelivery: "",
 BarcodeRedBox: "",
 CargoReturnRefusal: "false",
 DaysStorageCargo: "",
 Packaging: null,
 PartialReturnGoods: null,
 SecurePayment: "false",
 PossibilityChangeCash2Card: true,
 PossibilityChangeDeliveryIntervals: true,
 PossibilityTermExtensio: true,
 StorageAmount: "",
 StoragePrice: "",
 FreeShipping: "",
 LoyaltyCardRecipient: ""
}],
errors: [],
warnings: [],
info: [],
messageCodes: [],
errorCodes: [],
warningCodes: [],
infoCodes: []
} */


/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a965630e-8512-11ec-8ced-005056b2dbe1 */
export interface createMethodProperties {
  /* optional
  Цифрова адреса відділення відправника 
  "SenderWarehouseIndex" : "101/102" */
  SenderWarehouseIndex?: String36;
  /* optional
  Цифрова адреса відділення одержувача
  "RecipientWarehouseIndex" : "101/102" */
  RecipientWarehouseIndex?: String36;
  /* required
  Тип платника
  (Sender, Recipient, ThirdPerson) */
  PayerType: PayerType;
  /* required
  Форма розрахунку
  Cash/NonCash */
  PaymentMethod: PaymentMethod;
  /* required
  Дата відправки
  дд.мм.рррр */
  DateTime: String36;
  /* required
  Тип вантажу */
  CargoType: CargoType;
  /* optional / required (якщо не передається параметр OptionsSeat)
  Загальний об'єм, м.куб (min - 0.0004), обов'язково зазначати, якщо не передається параметр OptionsSeat */
  VolumeGeneral?: String36;
  /* required
  Фактична вага, в кг min - 0,1 */
  Weight: String36;
  /* required
  Технологія доставки DoorsDoors, DoorsWarehouse, WarehouseWarehouse, WarehouseDoors */
  ServiceType: ServiceType;
  /* required
  Кількість місць відправлення, ціле число */
  SeatsAmount: String36;
  /* required
  Текстове поле, вводиться для додаткогвого опису відправлення */
  Description: String36;
  /* required
  Оціночна вартість, ціле число (якщо не зазначити вартість то АРІ автоматично проставить мінімальну оціночну вартість =300.01) */
  Cost: String36;
  /* required
  Ідентифікатор міста відправника */
  CitySender: String36;
  /* required
  Ідентифікатор відправника */
  Sender: String36;
  /* required
  Ідентифікатор адреси відправника. REF адреси брати з відповіді методу Список адрес контрагента */
  SenderAddress: ObjectRef;
  /* required
  Ідентифікатор контактної особи відправника. REF брати з відповіді методу Список контактних осіб контрагента */
  ContactSender: ObjectRef;
  /* required
  Телефон відправника у форматі: +380660000000, 380660000000, 0660000001 */
  SendersPhone: String36;
  /* required
  Ідентифікатор міста отримувача */
  CityRecipient: String36;
  /* required
  Ідентифікатор отримувача */
  Recipient: String36;
  /* required
  Ідетнифікатор адреси отримувача/Ідентифікатор поштомату */
  RecipientAddress: String36;
  /* required
  Ідентифікатор контактної особи */
  ContactRecipient: String36;
  /* required
  Телефон отримувача у форматі: +380660000000, 380660000000, 0660000001 */
  RecipientsPhone: String36;
}

export interface createData {
  /*  Ідентификатор експрес-накладной */
  Ref: String36;
  /*  Вартість доставки */
  CostOnSite: String36;
  /*  Прогнозована дата доставки */
  EstimatedDeliveryDate: String36;
  /*  Номер експрес-накладной */
  IntDocNumber: String36;
  /*  Тип експрес-накладной */
  TypeDocument: String36;
}

export type CreateWaybillResponse = NovaPoshtaResponse<createData[]>;
/* const createResponse: CreateWaybillResponse = {
  success: true,
  data: [{
    Ref: "00000000-0000-0000-0000-000000000000",
    CostOnSite: "45",
    EstimatedDeliveryDate: "дд.мм.рррр",
    IntDocNumber: "20600000002545",
    TypeDocument: "InternetDocument",
  }],
  errors: [],
  warnings: [],
  info: [],
  messageCodes: [],
  errorCodes: [],
  warningCodes: [],
  infoCodes: [],
} */

/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a98a4354-8512-11ec-8ced-005056b2dbe1 */
export interface updateMethodProperties {
  /* required
  Іденифікатор (REF) експрес-накладної */
  Ref: String36;
  /* required
  Тип платника
  (Sender, Recipient, ThirdPerson) */
  PayerType: PayerType;
  /* required
  Форма розрахунку
  Cash/NonCash */
  PaymentMethod: PaymentMethod;
  /* required
  Дата відпраки у форматі
  дд.мм.рррр */
  DateTime: String36;
  /* required
  Тип вантажу */
  CargoType: CargoType;
  /* optional
  Загальний об'єм, м.куб (min - 0.0004), обов'язково зазначати, якщо не передається параметр OptionsSeat */
  VolumeGeneral?: String36;
  /* required
  Фактична вага, в кг min - 0,1 */
  Weight: String36;
  /* required
  Технологія доставки
  DoorsDoors, DoorsWarehouse, WarehouseWarehouse, WarehouseDoors */
  ServiceType: ServiceType;
  /* required
  Кількість місць відправлення, ціле число */
  SeatsAmount: String36;
  /* required
  Текстове поле, вводиться для додаткогвого опису відправлення */
  Description: String36;
  /* required
  Оціночна вартість, ціле число (якщо не зазначити вартість то АРІ автоматично проставить мінімальну оціночну вартість =300.00) */
  Cost: String36;
  /* required
  Ідентифікатор (REF) міста відправника */
  CitySender: String36;
  /* required
  Ідентифікатор (REF) відправника */
  Sender: String36;
  /* required
  Ідентифікатор (REF) адреси відправника */
  SenderAddress: ObjectRef;
  /* required
  Ідентифікатор (REF) контактної особи відправника */
  ContactSender: ObjectRef;
  /* required
  Телефон відправника
  +380660000000 */
  SendersPhone: String36;
  /* required
  Ідентифікатор (REF) міста отримувача */
  CityRecipient: String36;
  /* required
  Ідентифікатор (REF) отримувача */
  Recipient: String36;
  /* required
  Ідетнифікатор (REF) адреси отримувача/Ідентифікатор поштомату */
  RecipientAddress: String36;
  /* required
  Ідентифікатор (REF) контактної особи */
  ContactRecipient: String36;
  /* required
  Телефон отримувача у форматі: 
  +380660000000, 380660000000, 0660000001 */
  RecipientsPhone: String36;
}

export interface updateData {
  /* Ідентификатор (REF) експрес-накладної 
  "00000000-0000-0000-0000-000000000000"*/
  Ref: String36;
  /* Вартість доставки 
  "45"*/
  CostOnSite: String36;
  /* Прогнозована дата доставки 
  "дд.мм.рррр"*/
  EstimatedDeliveryDate: String36;
  /* Номер експрес-накладной 
  "20600000002545"*/
  IntDocNumber: String36;
  /* Тип експрес-накладной 
  "InternetDocument"*/
  TypeDocument: String36;
}

export type updateResponse = NovaPoshtaResponse<updateData[]>;
/* const response: updateResponse = {
  success: true,
  data: [{
    Ref: "00000000-0000-0000-0000-000000000000",
    CostOnSite: "45",
    EstimatedDeliveryDate: "дд.мм.рррр",
    IntDocNumber: "20600000002545",
    TypeDocument: "InternetDocument"
  }],
  errors: [],
  warnings: [],
  info: [],
  messageCodes: [],
  errorCodes: [],
  warningCodes: [],
  infoCodes: []
} */

/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a9f43ff1-8512-11ec-8ced-005056b2dbe1 */
export interface deleteMethodProp {
  /* Ідентифікатор (REF) документу 
  "00000000-0000-0000-0000-000000000000"*/
  DocumentRefs: String36;
}

export interface deleteData {
  /* Ідентифікатор (REF) видаленого документу */
  Ref: ObjectRef;
}

export type deleteResponse = NovaPoshtaResponse<deleteData[]>;
/* const response: deleteResponse = {
  success: true,
  data: [{
    "Ref": "00000000-0000-0000-0000-000000000000"
  }],
  errors: [],
  warnings: [],
  info: [],
  messageCodes: [],
  errorCodes: [],
  warningCodes: [],
  infoCodes: []
} */

/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a941c714-8512-11ec-8ced-005056b2dbe1 */
export interface MethodPropertiesDeliveryDate {
  /* optional 
  Дата створення ЕН 
  example: "DateTime" : "2024-05-31 15:00:00"*/
  DateTime?: String36;
  /* required
  Тип послуги 
  example: "WarehouseWarehouse"*/
  ServiceType: String36;
  /* required
  Ідентифікатор міста відправника 
  example: "00000000-0000-0000-0000-000000000000"*/
  CitySender: String36;
  /* required
  Ідентифікатор міста отримувача 
  example: "00000000-0000-0000-0000-000000000000"*/
  CityRecipient: String36;
}

export interface DeliveryDate {
  /* "date":"2024-07-10 18:00:00.000000" */
  date: string;
  /* "timezone_type":3" */
  timezone_type: number;
  /* "Europe\/Kiev" */
  timezone: string;
}

export type DeliveryDateResponse = NovaPoshtaResponse<{
  DeliveryDate: DeliveryDate
}[]>;
/* 
const response: DeliveryDateResponse = {
  success: true,
  data: [{
    DeliveryDate: {
      date: "2024-07-10 18:00:00.000000",
      timezone_type: 3,
      timezone: "Europe/Kiev",
    }
  }],
  errors: [],
  warnings: [],
  info: [],
  messageCodes: [],
  errorCodes: [],
  warningCodes: [],
  infoCodes: []
} */


/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/751067b8-9337-11ec-8ced-005056b2dbe1 */
export interface MethodPropertiesWithOptions {
  /* required
  Тип платника
  (Sender, Recipient, ThirdPerson) */
  PayerType: PayerType;
  /* required
  Форма розрахунку 
  Cash/NonCash */
  PaymentMethod: PaymentMethod;
  /* required
  Дата відправки у форматі 
  дд.мм.рррр */
  DateTime: String36;
  /* required
  Тип вантажу */
  CargoType: CargoType;
  /* optional || required(обов'язково зазначати, якщо не передається параметр OptionsSeat)
  Загальний об'єм, м.куб (min - 0.0004)
  "0.45" */
  VolumeGeneral?: String36;
  /* required
  Фактична вага, в кг min - 0,1 
  "0.5" */
  Weight: String36;
  /* required
  Технологія доставки 
  DoorsDoors, DoorsWarehouse, WarehouseWarehouse, WarehouseDoors */
  ServiceType: ServiceType;
  /* required
  Кількість місць відправлення, ціле число 
  "2" */
  SeatsAmount: String36;
  /* required
  Текстове поле, вводиться для додаткогвого опису відправлення 
  "Додатковий опис відправлення"*/
  Description: String36;
  /* required
  Оціночна вартість, ціле число (якщо не зазначити вартість то АРІ автоматично проставить мінімальну оціночну вартість =300.01) 
  "15000" */
  Cost: String36;
  /* required
  Ідентифікатор міста відправника 
  "00000000-0000-0000-0000-000000000000"*/
  CitySender: String36;
  /* required
  Ідентифікатор відправника 
  "00000000-0000-0000-0000-000000000000"*/
  Sender: String36;
  /* required
  Ідентифікатор адреси відправника. REF адреси брати з відповіді методу Список адрес контрагента 
  "00000000-0000-0000-0000-000000000000"*/
  SenderAddress: ObjectRef;
  /* required
  Ідентифікатор контактної особи відправника. REF брати з відповіді методу Список контактних осіб контрагента 
  "00000000-0000-0000-0000-000000000000"*/
  ContactSender: ObjectRef;
  /* required
  Телефон відправника
  +380660000000 || 380660000000 || 0660000001 */
  SendersPhone: String36;
  /* required
  Ідентифікатор міста отримувача 
  "00000000-0000-0000-0000-000000000000"*/
  CityRecipient: String36;
  /* required
  Ідентифікатор отримувача 
  "00000000-0000-0000-0000-000000000000"*/
  Recipient: String36;
  /* required
  Ідетнифікатор адреси отримувача/Ідентифікатор поштомату 
  "00000000-0000-0000-0000-000000000000"*/
  RecipientAddress: String36;
  /* required
  Ідентифікатор контактної особи 
  "00000000-0000-0000-0000-000000000000"*/
  ContactRecipient: String36;
  /* required
  Телефон отримувача
   +380660000000 || 380660000000 || 0660000001 */
  RecipientsPhone: String36;
  /* optional
  Номер штрихкоду RedBox (верхній регістр обов'язковий) 
  "RedBoxBarcode" : ""*/
  RedBoxBarcode?: String36;
  /* required
  Параметр вантажу для кожного місця відправлення */
  OptionsSeat: OptionsSeatItem[];
}

export interface SaveWaybillResponseData {
  Ref: string;
  CostOnSite: string;
  EstimatedDeliveryDate: string;
  IntDocNumber: string;
  TypeDocument: string;
}

export type WaybillWithOptionsResponse = NovaPoshtaResponse<SaveWaybillResponseData[]>;
/* const response: WaybillWithOptionsResponse = {
  success: true,
  data: [{
    Ref: "00000000-0000-0000-0000-000000000000",
    CostOnSite: "45",
    EstimatedDeliveryDate: "дд.мм.рррр",
    IntDocNumber: "20600000002545",
    TypeDocument: "InternetDocument"
  }],
  errors: [],
  warnings: [],
  info: [],
  messageCodes: [],
  errorCodes: [],
  warningCodes: [],
  infoCodes: []
} */
export interface RedeliveryCalculate {
  /* Тип вантажу: Cargo, Documents, TiresWheels, Pallet  */
  CargoType: CargoType;
  /* Сума зворотньої доставки  */
  Amount: String36;
}

export interface CargoDetail {
  /* Ідентифікатор(REF) типу відправлення  */
  CargoDescription: ObjectRef;
  /* Кількість одиниць  */
  Amount: String36;
}

export interface OptionsSeatItem {
  /* поля обов'язкові для відправлення поштоматом */
  /* required 
  Вага, кг
  Обмеження для поштомату max 20кг
  "required
  weight":"20"*/
  weight: string;
  /* required
  Ширина, см
  Обмеження для поштомату max 40 см
  "volumetricWidth":"30"*/
  volumetricWidth: string;
  /* required
  Довжина, см
  Обмеження для поштомату max 60 см
  "volumetricLength":"30"*/
  volumetricLength: string;
  /* required
  Висота, см
  Обмеження для поштомату max 30 см
  "volumetricHeight":"30"*/
  volumetricHeight: string;
  /* (необязательно) REF упаковки */
  packRef?: ObjectRef;
  /* 
  об'єм одного місця в кубічних метрах; 
  volumetricVolume":"1"*/
  volumetricVolume?: string;
}

/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/a91f115b-8512-11ec-8ced-005056b2dbe1 */
export interface PriceMethodProperties {
  /* required 
  Ідентифікатор(REF) міста відправника */
  CitySender: ObjectRef;
  /* required 
  Ідентифікатор(REF) міста отримувача */
  CityRecipient: ObjectRef;
  /* required 
  Фактична вага відправлення, кг */
  Weight: String36;
  /* required 
  Тип послуги */
  ServiceType: String36;
  /* required 
  Оціночна вартість */
  Cost: String36;
  /* required 
  Тип вантажу */
  CargoType: CargoType;
  /* required 
  Кількість місць відправлення */
  SeatsAmount: String36;

  /* optional
  Зворотня доставка (необязательное) */
  RedeliveryCalculate?: RedeliveryCalculate;
  /* optional
  Кількість пакування  */
  PackCount?: String36;
  /* optional
  Ідентифікатор пакування  */
  PackRef?: String36;
  /* optional
  Кількість одиниць  */
  Amount?: String36;
  /* optional
  Деталі вантажу */
  CargoDetails?: CargoDetail[];
  /* optional
  Ідентифікатор типу відправлення  */
  CargoDescription?: String36;

  /* optional
  Поле с данными о габаритах и упаковке */
  OptionsSeat?: OptionsSeatItem[];
}

export interface TZoneInfo {
  /* Назва тарифної зони */
  TzoneName: string;
  /* ID тарифної зони */
  TzoneID: string;
}

export interface PriceData {
  /* Оціночна вартість  */
  AssessedCost: String36;
  /* Вартість  */
  Cost: String36;
  /* Вартість зворотної доставки  */
  CostRedelivery: String36;
  /* Інформація про тарифну зону доставки */
  TZoneInfo: TZoneInfo;
  /* Вартість пакування  */
  CostPack: String36;
}

export type priceResponse = NovaPoshtaResponse<PriceData[]>;
/* 
const response: priceResponse = {
  "success": true,
  "data": [{
    "AssessedCost": "300",
    "Cost": "45",
    "CostRedelivery": "100",
    "TZoneInfo": {
      "TzoneName": "Тарифназона:Тарифназона4",
      "TzoneID": "4"
    },
    "CostPack": "4"
  }],
  "errors": [],
  "warnings": [],
  "info": [],
  "messageCodes": [],
  "errorCodes": [],
  "warningCodes": [],
  "infoCodes": []
} */

/* Обмеження:
Поштомат може бути лише відділенням одержувача;
Відправляти на поштамат можна тільки типи вантажу Посилка(Parcel) та Документи(Documents);
Максимальне значення оцінної вартості для відправки на поштомат(параметр Cost) – 10000 грн.;
Максимально допустимі габарити вантажу: Ширина 40 см; Довжина 60 см; Висота 30 см;
Максимально допустима вага вантажу 20 кг;
При створенні відправлення на поштомат можна вказувати лише одне місце на одне відправлення. */
/* https://developers.novaposhta.ua/view/model/a90d323c-8512-11ec-8ced-005056b2dbe1/method/0227072e-8f38-11ec-8ced-005056b2dbe1 */
export interface createPoshtomatMethodProperties {
  /* optional
  Цифрова адреса відділення відправника 
  "101/102" */
  SenderWarehouseIndex?: String36;
  /* optional
  Цифрова адреса поштомату отримувача 
  "11/3002"*/
  RecipientWarehouseIndex?: String36;
  /* required
  Тип платника 
  (Sender, Recipient, ThirdPerson) 
  */
  PayerType: PayerType;
  /* required
  Форма розрахунку Cash/NonCash */
  PaymentMethod: PaymentMethod;
  /* required
  Дата відправки 
  дд.мм.рррр */
  DateTime: String36;
  /* required
  Тип вантажу тільки Посилка (Parcel) або Документи (Documents) */
  CargoType: CargoType;
  /* required
  Фактична вага, в кг min - 0,1 
  "0.5" */
  Weight: String36;
  /* required
  Технологія доставки 
  DoorsWarehouse, WarehouseWarehouse */
  ServiceType: ServiceType;
  /* required
  Кількість місць відправлення, ціле число 
  "2" */
  SeatsAmount: String36;
  /* required
  Текстове поле, вводиться для додаткогвого опису відправлення 
  "Додатковий опис відправлення"*/
  Description: String36;
  /* required
  Оціночна вартість, ціле число (якщо не зазначити вартість то АРІ автоматично проставить мінімальну оціночну вартість =300.00) 
  "Cost" : "6000"*/
  Cost: String36;
  /* required
  Ідентифікатор (REF) міста відправника 
  "CitySender" : "00000000-0000-0000-0000-000000000000"*/
  CitySender: String36;
  /* required
  Ідентифікатор (REF) відправника 
  "Sender" : "00000000-0000-0000-0000-000000000000"*/
  Sender: String36;
  /* required
  Ідентифікатор (REF) адреси відправника. REF адреси брати з відповіді методу Список адрес контрагента 
  "00000000-0000-0000-0000-000000000000"*/
  SenderAddress: ObjectRef;
  /* required
  Ідентифікатор (REF) контактної особи відправника. REF брати з відповіді методу Список контактних осіб контрагента 
  "00000000-0000-0000-0000-000000000000"*/
  ContactSender: ObjectRef;
  /* required
  Телефон відправника
  +380660000000, 380660000000, 0660000001 */
  SendersPhone: String36;
  /* required
  Ідентифікатор(REF) міста отримувача 
  "CityRecipient" : "00000000-0000-0000-0000-000000000000"*/
  CityRecipient: ObjectRef;
  /* required
  Ідентифікатор (REF) отримувача 
  "Recipient" : "00000000-0000-0000-0000-000000000000"*/
  Recipient: ObjectRef;
  /* required
  Ідентифікатор (REF) поштомату 
  "RecipientAddress" : "00000000-0000-0000-0000-000000000000"*/
  RecipientAddress: ObjectRef;
  /* required
  Ідентифікатор (REF) контактної особи 
  "ContactRecipient" : "00000000-0000-0000-0000-000000000000"*/
  ContactRecipient: ObjectRef;
  /* required
  Телефон отримувача 
  +380660000000, 380660000000, 0660000001 */
  RecipientsPhone: String36;
  /* required
  Параметр вантажу для кожного місця відправлення */
  OptionsSeat: OptionsSeatItem[];
};
export interface poshtomatData {
  /* Ідентификатор експрес-накладной */
  Ref: String36;
  /* Вартість доставки */
  CostOnSite: String36;
  /* Прогнозована дата доставки */
  EstimatedDeliveryDate: String36;
  /* Номер експрес-накладной */
  IntDocNumber: String36;
  /* Тип експрес-накладной */
  TypeDocument: String36;
}

export type CreateWaybillPoshtomatResponse = NovaPoshtaResponse<poshtomatData[]>;

export interface cargoTypeProperties { /* пустой */ }

export interface cargoTypeData {
  /* Ідентифікатор 
  "Cargo"*/
  Ref: CargoType;
  /* Опис 
  "Вантаж"*/
  Description: String36;
}

export type cargoTypesResponse = NovaPoshtaResponse<cargoTypeData[]>;

export interface timeIntervalsProperties {
  /* required 
  Ідентифікатор (REF) міста для якого будуть отримані часові інтервали
  "00000000-0000-0000-0000-000000000000"*/
  RecipientCityRef: String36;
  /* optional
  Дата на яку будуть отримані часові інтервали (необов'язковий параметр) за замовчанням дорівнює поточній даті, 
  "DateTime" : "09-18-16" */
  DateTime?: String36;
}
export interface timeIntervalsData {
  /* Ідентифікатор
  "Number" : "CityDeliveryTimeInterval2" */
  Number: String50;
  /* Час початку інтервалу
  "12:00"*/
  Start: String36;
  /* Час закінчення інтервалу
  "15:00" */
  End: String36;
}

export type timeIntervalsResponse = NovaPoshtaResponse<timeIntervalsData[]>;


export interface palletsListProperties {/* пустой */ }
interface palletsListResponseData {
  /* Ідентифікатор(REF) палети */
  Ref: ObjectRef,
  /* Опис палети українською мовою */
  Description: String36,
  /* Опис палети російською мовою */
  DescriptionRu: String36,
  /* Вага */
  Weight: String36,
}

export type palletsListResponse = NovaPoshtaResponse<palletsListResponseData[]>;

export interface packListProperties {
  /* optional
  Довжина 
  "10"*/
  Lengthstring?: String36,
  /* optional
  Вага
  "2"*/
  Widthstring?: String36,
  /* optional
  Висота
  "15"*/
  Heightstring?: String36,
  /* optional
  Об'єм
  "8.54"*/
  VolumetricWeightstring?: String36,
  /* optional
  Тип пакування
  ""*/
  TypeOfPackingstring?: String36,
}
interface PackListResponseData {
  /* Ідентифікатор 
  "00000000-0000-0000-0000-000000000000"*/
  Ref: String36,
  /* Опис українською мовою 
  "Гофрокартон 3-шаровий"*/
  Description: String36,
  /* Опис російською мовою 
  "Гофрокартон 3-слойный"*/
  DescriptionRu: String36,
  /* Довжина пакування 
  "1000.0"*/
  Length: String36,
  /* Вага пакування 
  "1000.0"*/
  Width: String36,
  /* Висота пакування 
  "0.0"*/
  Height: String36,
  /* Об'єм пакування 
  "0.00"*/
  VolumetricWeight: String36,
  /* Тип пакування(не використовується) 
  ""*/
  TypeOfPacking: String36,
}

export type packListResponse = NovaPoshtaResponse<PackListResponseData[]>;

interface tiresWheelsListResponseData {
  /* Ідентифікатор 
  "00000000-0000-0000-0000-000000000000"*/
  Ref: String36,
  /* Опис українською мовою 
  "Description" : "Шина легкова R 13-14" */
  Description: String36,
  /* Опис російською мовою 
  "DescriptionRu" : "Шина легковая R 13-14" */
  DescriptionRu: String36,
  /* Вага 
  "Weight" : "14.90"*/
  Weight: String36,
  /* Опис типу позиції Tires / Wheels 
  "DescriptionType" : "Tires"*/
  DescriptionType: String36,
}

export type tiresWheelsListResponse = NovaPoshtaResponse<tiresWheelsListResponseData[]>;


export interface packListProperties {
  /* optional
  Пошук по рядках 
  "FindByString" : "Вантаж"*/
  FindByString?: String36,
  /* optional
  Сторінка(до 500 записів на сторінці) 
  "Page" : "1"*/
  Page?: String36,
}
interface cargoDescriptionListResponseData {
  /* Ідентифікатор 
  "00000000-0000-0000-0000-000000000000"*/
  Ref: String36,
  /* Опис українською мовою 
  "Description" : "DVD/HD- медіаплеєр" */
  Description: String36,
  /* Опис російською мовою 
  "DescriptionRu" : "DVD/HD- медіаплеєр" */
  DescriptionRu: String36
}

export type cargoDescriptionListResponse = NovaPoshtaResponse<cargoDescriptionListResponseData[]>;

interface messageCodeTextResponseData {
  /* Код помилки 
  "MessageCode" : "20000100004"*/
  MessageCode: String36,
  /* Опис англійською мовою 
  "MessageText" : "User with email exists"*/
  MessageText: String100,
  /* Опис російською мовою 
  "MessageDescriptionRU" : "Отсутствует пользователь с таким Email",*/
  MessageDescriptionRU: String100,
  /* Опис українською мовою 
  "MessageDescriptionUA" : "Відсутній користувач з таким Email"*/
  MessageDescriptionUA: String100,
}

export type messageCodeTextResponse = NovaPoshtaResponse<messageCodeTextResponseData[]>;

interface serviceTypesResponseData {
  /* Ідентифікатор 
  "Ref" : "DoorsDoors" */
  Ref: String36,
  /* Опис українською мовою 
  "Description" : "Двері-Двері" */
  Description: String36
}

export type serviceTypesResponse = NovaPoshtaResponse<serviceTypesResponseData[]>;

interface ownershipFormsListResponseData {
  /* Ідентифікатор 
  "Ref" : "00000000-0000-0000-0000-000000000000" */
  Ref: String36,
  /* Опис українською мовою 
  "Description" : "ООО" */
  Description: String36,
  /* Найменування форми власності 
  "FullName" : "Общество с ограниченной ответственностью"*/
  FullName: String36
}

export type ownershipFormsListResponse = NovaPoshtaResponse<ownershipFormsListResponseData[]>;

export interface pickupTimeIntervalsProperties {
  /* required
  Ідентифікатор(REF) адреси відправника 
  "SenderCityRef" : ""00000000-0000-0000-0000-000000000000",*/
  SenderCityRef: String36,
  /* required
  Дата доступних для вибору часових інтервалів 
  "DateTime" : ""29.12.2023"*/
  DateTime: String36,
}

interface pickupTimeIntervalsResponseData {
  /* Назва часового інтервалу 
  "Number" : "CityPickingTimeInterval3"*/
  Number: String36,
  /* Час початку дії часового інтервалу 
  "Start" : ""08:00"*/
  Start: String36,
  /* Час завершення дії часового інтервалу 
  "End" : ""17:00"*/
  End: String36,
  /* Піковий час забору посилки 
  "BoundaryTime" : ""14:50"*/
  BoundaryTime: String36,
}

export type pickupTimeIntervalsResponse = NovaPoshtaResponse<pickupTimeIntervalsResponseData[]>;

export interface settlementsProperties {
  /* optional
  Ідентифікатор області 
  "Ref" : "00000000-0000-0000-0000-000000000000" */
  Ref?: String36,
}
interface settlementsResponseData {
  /* Назва області 
  "Description" : "Вінницька"*/
  Description: String50,
  /* Ідентифікатор(REF) області 
  "Ref" : "00000000-0000-0000-0000-000000000000"*/
  Ref: String36,
  /* Адміністративний центр області.Він же ідентифікатор населеного пункту(REF) 
  "AreasCenter" : "00000000-0000-0000-0000-000000000000"*/
  AreasCenter: String36,
  /* Назва типу обласного об'єкту 
  "RegionType" : "область"*/
  RegionType: String50
}

export type settlementsResponse = NovaPoshtaResponse<settlementsResponseData[]>;

export interface settlementsCountryRegionProperties {
  /* required
  Ідентифікатор області 
  "Ref" : "dcaad3d6-4b33-11e4-ab6d-005056801329" */
  AreaRef: String36,
}
interface settlementsCountryRegionResponseData {
  /* Ідентифікатор(REF) області 
  "Ref" : "e4abe7d0-4b33-11e4-ab6d-005056801329"*/
  Ref: String36,
  /* Назва області 
  "Description" : "Ананьївський"*/
  Description: String50,
  /* Назва типу обласного об'єкту 
  "RegionType" : "район"*/
  RegionType: String50,
  /* Адміністративний центр області.Він же ідентифікатор населеного пункту(REF) 
  "AreasCenter" : "e71414e9-4b33-11e4-ab6d-005056801329"*/
  AreasCenter: String36,
}

export type settlementsCountryRegionResponse = NovaPoshtaResponse<settlementsCountryRegionResponseData[]>;

export interface citiesProperties {
  /* optional
  Ідентифікатор міста
  "Ref" : "00000000-0000-0000-0000-000000000000"*/
  Ref?: String36,
  /* optional
  Пошук по назві міста
  "FindByString" : "Київ"*/
  FindByString?: String36,
  /* optional
  Номер сторінки для відображення
  "Page" : "1" */
  Page?: String36,
  /* optional
  Кількість записів на сторінці. Працює разом з параметром Page 
  "Limit" : "" */
  Limit?: String36,
}

interface citiesResponseData {
  /* Місто українською мовою 
  "Description" : "Київ"*/
  Description: String50,
  /* Місто російською мовою 
  "DescriptionRu" : "Киев" */
  DescriptionRu: String50,
  /* Ідентифікатор міста 
  "Ref" : "00000000-0000-0000-0000-000000000000"*/
  Ref: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery1" : "1"*/
  Delivery1: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery2" : "1"*/
  Delivery2: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery3" : "1"*/
  Delivery3: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery4" : "1"*/
  Delivery4: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery5" : "1"*/
  Delivery5: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery6" : "0"*/
  Delivery6: String36,
  /* Наявність доставки відправлення в днях тижня 
  "Delivery7" : "0"*/
  Delivery7: String36,
  /* Область 
  "Area" : "00000000-0000-0000-0000-000000000000"*/
  Area: String36,
  /* Ідентифікатор(реф) типу населеного пункту 
  "SettlementType" : "00000000-0000-0000-0000-000000000000"*/
  SettlementType: String36,
  /* Ознака приналежності міста до філіальної мережі НП(1 / 0).
  Якщо 1 - то філіал, якщо 0 - то партнер 
  "IsBranch" : "0"*/
  IsBranch: String36,
  /* Ознака налаштування "Заборонити ведення нових вулиць користувачем"(1 / 0) 
  "PreventEntryNewStreetsUser" : "null"*/
  PreventEntryNewStreetsUser: String36,
  /* Конгломерат 
  "Conglomerates" : "null"*/
  Conglomerates: String36,
  /* Код міста 
  "CityID" : "890" */
  CityID: String36,
  /* Опис типу населеного пункту російською мовою 
  "SettlementTypeDescriptionRu" : "село"*/
  SettlementTypeDescriptionRu: String36,
  /* Опис типу населеного пункту українською мовою 
  "SettlementTypeDescription" : "село"*/
  SettlementTypeDescription: String36,
}
export type citiesResponse = NovaPoshtaResponse<citiesResponseData[]>;


export interface streetProperties {
  /* required
  Ідентифікатор(REF) міста, брати REF з відповіді Довідника міст компанії
  "CityRef" : "00000000-0000-0000-0000-000000000000" */
  CityRef: String36,
  /* (required) - по документации
  optional - фактически работает только без нее
  Пошук по рядках
  "FindByString" : "Київ"*/
  /* В документации указано обязательным, 
  но фактически с этим полем запрос не работает,
  без него возвращает все улициы */
  FindByString?: String36,
  /* optional
  Сторінка до 500 записів на сторінці 
  "Page" : "1" */
  Page?: String36,
  /* optional
  Кількість записів на сторінці.Працює разом з параметром Page 
  "Limit" : "" */
  Limit?: String36,
}
interface streetResponseData {
  /* Ідентифікатор (REF) вулиці
  "Ref" : "59e0b106-49a2-11dd-9198-001d60451983"*/
  Ref: String36,
  /* Назва вулиці українською мовою
  "Description" : "18-а"*/
  Description: String50,
  /* Ідентифікатор (REF) типу вулиці
  "StreetsTypeRef" : "Line"*/
  StreetsTypeRef: String50,
  /* Тип вулиці
  "StreetsType" : "лінія"*/
  StreetsType: String36,
}

export type streetResponse = NovaPoshtaResponse<streetResponseData[]>;

export interface searchSettlementsProperties {
  /* required
  Назва населеного пункту або Індекс населеного пункту
  не обязательно вводить полное название города
  "CityName" : "київ" */
  CityName: String36,
  /* required
  Сторінка до 500 записів на сторінці 
  "Page" : "1" */
  Page: String36,
  /* required
  Кількість записів на сторінці.Працює разом з параметром Page 
  ограничивает количество объектов в result.data[0].Addresses
  "Limit" : "50" */
  Limit: String36,
}
interface searchSettlementsResponseData {
  /* Кількість знайдених об'єктів 
  "TotalCount" : "235"*/
  TotalCount: String36,
  /* Адреса 
  "Addresses" : [{
  "Warehouses":0",
  "MainDescription":"Київ",
  "Area":"Миколаївська",
  "Region":"Доманівський",
  "SettlementTypeCode":"с.",
  "Ref":"0db2df4b-4b3a-11e4-ab6d-005056801329",
  "DeliveryCity":"06f8795a-4079-11de-b509-001d92f78698" }]*/
  Addresses: [],
  /* Кількість відділень 
  "Warehouses" : "568" */
  Warehouses: String36,
  /* Назва населених пунктів
  "MainDescription" : "Київ" */
  MainDescription: String50,
  /* Ознака області 
  "Area" : "обл"*/
  Area: String50,
  /* Ознака району 
  "Region" : "Київська"*/
  Region: String50,
  /* Абревіатура типу населеного пункту
  "SettlementTypeCode" : "м." */
  SettlementTypeCode: String50,
  /* REF міста із довідника getSettlements
  "Ref" : "00000000-0000-0000-0000-000000000000" */
  Ref: String50,
  /* REF міста із довідника getCities, з якого виконується доставка 
  "DeliveryCity" : "00000000-0000-0000-0000-000000000000" */
  DeliveryCity: String50,
}
export type searchSettlementsResponse = NovaPoshtaResponse<searchSettlementsResponseData[]>;

export interface searchSettlementStreetsProperties {
  /* required
  Назва населеного пункту або Індекс населеного пункту
  "StreetName" : "Хрещатик" */
  StreetName: String36,
  /* required
  Ідентифікатор (REF) населеного пункту із довідника населених пунктів України 
  перед запросом необходимо получить в справочнике городов
  "SettlementRef" : "00000000-0000-0000-0000-000000000000" */
  SettlementRef: String36,
  /* optional
  Кількість відповідей 
  "Limit" : "50" */
  Limit?: String36,
}
interface addressesLocation {
  /* Географічна широта локації 
  lat: "50.44806099962443"*/
  lat: "50.44806099962443",
  /* Географічна довгота локації
  lon: "30.52225599065423" */
  lon: "30.52225599065423",
}
interface StreetsDataAddressesItem {
  /* Унікальний ідентифікатор (REF) населеного пункту
  "SettlementRef" : "00000000-0000-0000-0000-000000000000" */
  SettlementRef: String50,
  /* Унікальний ідентифікатор (REF) вулиці
  "SettlementStreetRef":"ad090b1f-6845-11e6-8304-00505688561d" */
  SettlementStreetRef: String50,
  /* Назва вулиці
  SettlementStreetDescription: "Хрещатик" */
  SettlementStreetDescription: String50,
  /* Повна назва вулиці, що включає тип вулиці та її назву
  Present: "вул. Хрещатик" */
  Present: String50,
  /* Унікальний ідентифікатор (REF) типу вулиці (наприклад, вулиця, проспект тощо)
  StreetsType: "0f1d7fbb-4bba-11e4-ab6d-005056801329" */
  StreetsType: String50,
  /* Тип вулиці
  StreetsTypeDescription: "вул." */
  StreetsTypeDescription: String50,
  /* Локація */
  Location: addressesLocation
  /* Назва вулиці російською мовою.
  "SettlementStreetDescriptionRu":"Крещатик" */
  SettlementStreetDescriptionRu: String50
}
interface searchSettlementStreetsData {
  /* Кількість знайдениї об'єктів
  "TotalCount" : "1" */
  TotalCount: String36,
  /*  */
  Addresses: StreetsDataAddressesItem[]
}
export type searchSettlementStreetsResponse = NovaPoshtaResponse<searchSettlementStreetsData[]>;
