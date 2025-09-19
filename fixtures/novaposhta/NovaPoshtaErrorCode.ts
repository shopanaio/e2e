export enum NovaPoshtaErrorCode {
  /* Помилка активації */
  ActivationError = "20000100007",
  /* Виникла невідома помилка. Спробуйте пізніше */
  UnknownError = "20000100008",
  /* Неможливо створити обліковий запис */
  CannotCreateVipUser = "20000100010",
  /* Помилка створення API-ключа */
  ApiKeyGenerationError = "20000100012",
  /* Не вдалося отримати номер картки лояльності */
  GetLoyaltyCardFail = "20000100013",
  /* Некоректні дані */
  IncorrectData = "20000100014",
  /* Неправильний логін або пароль */
  InvalidLoginOrPassword = "20000100015",
  /* Сервіс недоступний */
  ServiceUnavailable = "20000100016",
  /* На жаль, вказаний E-mail вже використовується іншим учасником програми лояльності */
  EmailAlreadyUsed = "20000100017",
  /* Некоректний номер телефону */
  InvalidPhoneNumber = "20000100018",
  /* Этому контрагенту запрещено участие в программе лояльности */
  CounterpartyLoyaltyProhibited = "20000100019",
  /* Неправильный код из смс */
  IncorrectSmsCode = "20000100020",
  /* Невозможно сохранить данные */
  UnableToSaveData = "20000100021",
  /* Невозможно отправить SMS */
  UnableToSendSms = "20000100022",
  /* Пользователь уже существует */
  UserAlreadyExists = "20000100023",
  /* Пользователь не найден */
  UserNotFound = "20000100024",
  /* Vip клиент с этим email уже зарегистрирован */
  VipClientEmailExists = "20000100025",
  /* Неправильный код активации */
  WrongActivationCode = "20000100026",
  /* Некорректный пароль или пользователь не найден */
  WrongPasswordOrUserNotFound = "20000100027",
  /* Слишком длинное значение поля Сопроводительные документы */
  AccompanyingDocumentsLengthIncorrect = "20000200028",
  /* Код ЕДРПОУ и сумма должны быть заполнены */
  AccountNumberAndSumRequired = "20000200029",
  /* Длина поля "Дополнительная информация" превышена */
  AdditionalInformationLengthIncorrect = "20000200030",
  /* Контроль оплаты отключен для InPost */
  AfterpaymentDisabledForInPost = "20000200031",
  /* Контроль оплаты отключен для NovaPoshta */
  AfterpaymentDisabledForNovaPoshta = "20000200032",
  /* Сумма контроля оплаты указана некорректно */
  AfterpaymentInvalid = "20000200033",
  /* Превышена сумма контроля оплаты */
  AfterpaymentTooHigh = "20000200034",
  /* Контроль оплаты недоступен */
  AfterpaymentUnavailable = "20000200035",
  /* Контроль оплаты недоступен в выбранном городе получателя */
  AfterpaymentUnavailableInCityRecipient = "20000200036",
  /* Поле Контроль оплаты должно быть заполнено */
  AfterpaymentMustBeFilled = "20000200037",
  /* Сумма контроля оплаты для Двери-Двери превышает лимит */
  AfterpaymentToDoorsDoorsTooHigh = "20000200038",
  /* Сумма контроля оплаты для Склад-Двери превышает лимит */
  AfterpaymentToWarehouseDoorsTooHigh = "20000200039",
  /* Параметр Контроль оплаты должен быть массивом */
  AfterpaymentInfoMustBeArray = "20000200040",
  /* Альтернативное контактное лицо получателя слишком длинное */
  AlternativeContactRecipientTooLong = "20000200041",
  /* Альтернативный тип плательщика не выбран */
  AlternativePayerTypeNotSelected = "20000200042",
  /* Альтернативный способ оплаты не выбран */
  AlternativePaymentMethodNotSelected = "20000200043",
  /* Альтернативный способ оплаты - безналичный расчет недоступен */
  AlternativePaymentNonCashUnavailable = "20000200044",
  /* Альтернативный получатель не принадлежит этому пользователю */
  AlternativeRecipientNotBelongToUser = "20000200046",
  /* Альтернативный получатель не существует */
  AlternativeRecipientNotExists = "20000200047",
  /* Альтернативный получатель некорректный */
  AlternativeRecipientIncorrect = "20000200048",
  /* Альтернативный получатель удален */
  AlternativeRecipientRemoved = "20000200049",
  /* Альтернативный получатель не выбран */
  AlternativeRecipientNotSelected = "20000200050",
  /* Адрес альтернативного получателя не принадлежит этому получателю */
  AlternativeRecipientAddressNotBelong = "20000200051",
  /* Адрес альтернативного получателя не существует */
  AlternativeRecipientAddressNotExists = "20000200052",
  /* Адрес альтернативного получателя некорректен */
  AlternativeRecipientAddressIncorrect = "20000200053",
  /* Адрес альтернативного получателя удален */
  AlternativeRecipientAddressRemoved = "20000200054",
  /* Адрес альтернативного получателя не выбран */
  AlternativeRecipientAddressNotSelected = "20000200055",
  /* Город альтернативного получателя указан некорректно */
  AlternativeRecipientCityIncorrect = "20000200056",
  /* Город альтернативного получателя не найден */
  AlternativeRecipientCityNotFound = "20000200057",
  /* Город альтернативного получателя не выбран */
  AlternativeRecipientCityNotSelected = "20000200058",
  /* Контактное лицо альтернативного получателя не принадлежит этому получателю */
  AlternativeRecipientContactNotBelong = "20000200059",
  /* Контактное лицо альтернативного получателя не существует */
  AlternativeRecipientContactNotExists = "20000200060",
  /* Контактное лицо альтернативного получателя указано некорректно */
  AlternativeRecipientContactIncorrect = "20000200061",
  /* Контактное лицо альтернативного получателя удалено */
  AlternativeRecipientContactRemoved = "20000200062",
  /* Контактное лицо альтернативного получателя не выбрано */
  AlternativeRecipientContactNotSelected = "20000200063",
  /* Тип плательщика альтернативного получателя некорректен */
  AlternativeRecipientPayerTypeIncorrect = "20000200064",
  /* Способ оплаты для альтернативного получателя некорректен */
  AlternativeRecipientPaymentMethodIncorrect = "20000200065",
  /* Неверный формат номера телефона альтернативного получателя */
  AlternativeRecipientPhoneInvalidFormat = "20000200066",
  /* Телефон альтернативного получателя не указан */
  AlternativeRecipientPhoneEmpty = "20000200067",
  /* Ошибка аутентификации API */
  ApiAuthFail = "20000200068",
  /* API-ключ не указан */
  ApiKeyEmpty = "20000200069",
  /* Массив обратной доставки неправильно сформирован */
  BackwardDeliveryDataArrayInvalid = "20000200070",
  /* Массив возврата поддонов неправильно сформирован */
  TraysArrayInvalid = "20000200071",
  /* Обратная доставка запрещена в Крыму */
  BackwardDeliveryBannedInCrimea = "20000200072",
  /* Обратная доставка недоступна для этого города */
  BackwardDeliveryBannedInCity = "20000200073",
  /* Сумма обратной доставки слишком высокая */
  BackwardDeliveryMoneyTooHigh = "20000200074",
  /* Тип груза обратной доставки некорректен */
  BackwardDeliveryCargoTypeIncorrect = "20000200075",
  /* Тип плательщика обратной доставки должен отличаться */
  BackwardDeliveryCargoTypeMustBeDifferent = "20000200076",
  /* Обратная доставка не входит в список допустимых услуг */
  BackwardDeliveryDocumentsServicesNotService = "20000200077",
  /* Обратная доставка денег недоступна в выбранном городе получателя */
  BackwardDeliveryMoneyUnavailableInCityRecipient = "20000200078",
  /* Неправильно указана сумма обратной доставки */
  BackwardDeliveryMoneyRedeliveryStringInvalid = "20000200079",
  /* Сумма обратной доставки не может быть меньше 1 грн */
  BackwardDeliveryMoneyRedeliveryStringLessThanOne = "20000200080",
  /* Сумма обратной доставки для Двери-Двери превышает лимит */
  BackwardDeliveryMoneyToDoorsDoorsTooHigh = "20000200081",
  /* Сумма обратной доставки для Склад-Двери превышает лимит */
  BackwardDeliveryMoneyToWarehouseDoorsTooHigh = "20000200082",
  /* Обратная доставка должна быть "Деньги" */
  BackwardDeliveryMustBeMoney = "20000200083",
  /* Тип плательщика обратной доставки не может отличаться */
  BackwardDeliveryPayerTypeCannotBeDifferent = "20000200084",
  /* Значение плательщика обратной доставки некорректно */
  BackwardDeliveryPayerTypeIncorrect = "20000200085",
  /* Обратная доставка должна быть массивом */
  BackwardDeliveryDataMustBeArray = "20000200086",
  /* Обратная доставка рублей для Двери-Двери слишком большая */
  BackwardDeliveryRubMoneyToDoorsDoorsTooHigh = "20000200087",
  /* Обратная доставка рублей для Склад-Двери слишком большая */
  BackwardDeliveryRubMoneyToWarehouseDoorsTooHigh = "20000200088",
  /* Описание груза указано неверно */
  CargoDescriptionInvalid = "20000200090",
  /* Значение количества не указано */
  CargoDetailsAmountEmpty = "20000200091",
  /* Значение количества указано неверно */
  CargoDetailsAmountInvalid = "20000200092",
  /* Значение количества превышает лимит */
  CargoDetailsAmountTooHigh = "20000200093",
  /* Описание груза не передано */
  CargoDetailsCargoDescriptionEmpty = "20000200094",
  /* Описание груза указано неверно */
  CargoDetailsCargoDescriptionIncorrect = "20000200095",
  /* Значение количества недействительно */
  CargoDetailsCountInvalid = "20000200096",
  /* Параметр количество должен быть массивом */
  CargoDetailsMustBeArray = "20000200097",
  /* Параметр количество должен быть пустым */
  CargoDetailsMustBeEmpty = "20000200098",
  /* Тип груза не выбран */
  CargoTypeNotSelected = "20000200099",
  /* Сертификат */
  Certificate = "20000200101",
  /* Город получателя указан некорректно */
  CityRecipientIncorrect = "20000200102",
  /* Город получателя не найден */
  CityRecipientNotFound = "20000200103",
  /* Город получателя не выбран */
  CityRecipientNotSelected = "20000200104",
  /* Город отправителя некорректен */
  CitySenderIncorrect = "20000200105",
  /* Город отправителя не найден */
  CitySenderNotFound = "20000200106",
  /* Город отправителя не выбран */
  CitySenderNotSelected = "20000200107",
  /* Контакт получателя не принадлежит этому получателю */
  ContactRecipientNotBelongToRecipient = "20000300397",
  /* Контакт получателя не существует */
  ContactRecipientNotExists = "20000300398",
  /* Контакт получателя указан некорректно */
  ContactRecipientIncorrect = "20000300399",
  /* Контакт получателя удален */
  ContactRecipientRemoved = "20000300400",
  /* Контакт получателя не выбран */
  ContactRecipientNotSelected = "20000300401",
  /* Контакт отправителя не принадлежит этому отправителю */
  ContactSenderNotBelongToSender = "20000300402",
  /* Контакт отправителя не существует */
  ContactSenderNotExists = "20000300403",
  /* Контакт отправителя указан некорректно */
  ContactSenderIncorrect = "20000300404",
  /* Контакт отправителя удален */
  ContactSenderRemoved = "20000300405",
  /* Контакт отправителя не выбран */
  ContactSenderNotSelected = "20000300406",
  /* Стоимость некорректна */
  CostInvalid = "20000200118",
  /* Стоимость слишком высокая */
  CostTooHigh = "20000200119",
  /* Стоимость должна быть строкой */
  CostShouldBeString = "20000200120",
  /* Вартість від не може бути менше, ніж вартість до */
  CostFromCannotBeLessThanCostTo = "20000300407",
  /* Вартість від недійсна */
  CostFromInvalid = "20000300408",
  /* Вартість від занадто велика */
  CostFromTooHigh = "20000300409",
  /* Значення фільтра "Вартість доставки від" не може бути меншим, ніж значення фільтра "Вартість доставки до" */
  CostOnSiteFromCannotBeLessThanCostOnSiteTo = "20000200124",
  /* Значення фільтра "Вартість доставки від" недійсне */
  CostOnSiteFromInvalid = "20000200125",
  /* Значення фільтра "Вартість доставки від" занадто велике */
  CostOnSiteFromTooHigh = "20000200126",
  /* Значення фільтра "Вартість доставки до" недійсне */
  CostOnSiteToInvalid = "20000200127",
  /* Значення фільтра "Вартість доставки до" занадто велике */
  CostOnSiteToTooHigh = "20000200128",
  /* Вартість до недійсний */
  CostToInvalid = "20000300410",
  /* Вартість до занадто велика */
  CostToTooHigh = "20000300411",
  /* Проблема створення Контрагента */
  CounterpartyCreationProblem = "20000200131",
  /* Контрагент для альтернативної оплати за безготівковим розрахунком недійсний */
  CounterpartyForAlternativePaymentNonCashInvalid = "20000200132",
  /* Для вибраного Контрагента послуга контролю поштучної передачі недоступна */
  CounterpartyForForwardingCountInvalid = "20000200133",
  /* Для вибраного Контрагента послуга забору довіреності недоступна */
  CounterpartyForIsTakeAttorneyInvalid = "20000200134",
  /* Контрагент для оплати за безготівковим розрахунком недійсний */
  CounterpartyForPaymentNonCashInvalid = "20000200135",
  /* Контрагент для доставки день у день недійсний */
  CounterpartyForSameDayDeliveryInvalid = "20000200136",
  /* Контрагент для третьої особи недійсний */
  CounterpartyForThirdPersonInvalid = "20000200137",
  /* Контрагента не знайдено у вибраному місті */
  CounterpartyNotFoundByCity = "20000200138",
  /* Країна відправника недійсна */
  CountrySenderInvalid = "20000200139",
  /* Країна відправника обов'язкова */
  CountrySenderRequired = "20000200140",
  /* Фільтр Дата створення невірний формат */
  CreateTimeFilteringInvalidFormat = "20000300412",
  /* Дата не може бути менше, ніж сьогодні */
  DateTimeCannotBeLessThanNow = "20000400455",
  /* Дата створення доставки не може бути меншою за бажану дату доставки */
  DateTimeCannotBeLessThanPreferredDeliveryDate = "20000200143",
  /* Фільтр Дата доставки невірний формат */
  DateTimeFilteringInvalidFormat = "20000300413",
  /* Дата створення доставки відсутня */
  DateTimeEmpty = "20000200145",
  /* Дата доставки невірний формат */
  DateTimeInvalidFormat = "20000400456",
  /* Доставка повинна бути на адресу */
  DeliveryMustBeToTheDoor = "20000200147",
  /* Послуга "Доставка особисто в руки" недійсна. Редагування для адресної доставки - заборонено. */
  DeliveryByHandInvalid = "20000200148",
  /* Фільтр DeliveryDateTime невірний формат */
  DeliveryDateTimeFilteringInvalidFormat = "20000300414",
  /* Опис відсутній */
  DescriptionEmpty = "20000200150",
  /* Опис недійсний */
  DescriptionNotValid = "20000200151",
  /* Опис занадто довгий */
  DescriptionTooLong = "20000200152",
  /* Документ в реєстрі */
  DocumentInRegistry = "20000200153",
  /* Документ уже роздруковано */
  DocumentAlreadyPrinted = "20000200154",
  /* Документ не знайдено */
  DocumentNotFound = "20000300415",
  /* Документ не знайдено власником */
  DocumentNotFoundByOwner = "20000300416",
  /* Номер документа не заповнено */
  DocumentNumberEmpty = "20000200157",
  /* Номер документа некоректний */
  DocumentNumberIncorrect = "20000200158",
  /* Документи повинні бути масивом */
  DocumentsMustBeArray = "20000200159",
  /* Документи не знайдені */
  DocumentsNotFound = "20000200161",
  /* Неправильний формат значення Опис Зворотної доставки */
  DocumentsRedeliveryNotValid = "20000200162",
  /* Значення поля Зворотна доставка документів занадто довге */
  DocumentsRedeliveryTooLong = "20000200163",
  /* ЄДРПОУ некоректний */
  EdrpouInvalid = "20000200164",
  /* ЄДРПОУ не повинен бути порожнім */
  EdrpouMustNotBeEmpty = "20000200165",
  /* Не вдалося перетворити район у місто */
  FailedToConvertSettlementToCity = "20000200166",
  /* Не вдалося створити номер будинку одержувача */
  FailedToCreateRecipientBuilding = "20000200167",
  /* Не вдалося створити номер будинку відправника */
  FailedToCreateSenderBuilding = "20000200168",
  /* Не вдалося підтвердити номер будинку одержувача */
  FailedToValidateRecipientBuildingNumber = "20000200169",
  /* Не вдалося підтвердити реф-ідентифікатор вулиці одержувача */
  FailedToValidateRecipientSettlementStreetRef = "20000200170",
  /* Не вдалося підтвердити номер будинку відправника */
  FailedToValidateSenderBuildingNumber = "20000200171",
  /* Не вдалося підтвердити реф-ідентифікатор вулиці відправника */
  FailedToValidateSenderSettlementStreetRef = "20000200172",
  /* Заповнення гарантійного талона некоректне */
  FillingWarrantyIncorrect = "20000200173",
  /* Заповнення гарантійного талона недоступно */
  FillingWarrantyUnavailable = "20000200174",
  /* Для зворотної доставки значення "Тип платника" повинно бути Відправник */
  ForBackwardDeliveryTraysPayerTypeMustBeSender = "20000200175",
  /* Послуга експедирування недоступна для обраного контрагента */
  ForwardingCountUnavailable = "20000200176",
  /* Значення Висота порожня */
  HeightEmpty = "20000400460",
  /* Значення "Висота" задовге */
  HeightTooHigh = "20000200179",
  /* Значення "Висота" задовге для поштомата InPost */
  HeightTooHighForInPost = "20000200180",
  /* Значення "Висота" задовге для поштомата PostomatNP */
  HeightTooHighForPostomatNP = "20000200181",
  /* Неможливо доставити вантаж у святковий день */
  ImpossibleToDeliverCargoOnHoliday = "20000200182",
  /* Неможливо доставити вантаж в цей день */
  ImpossibleToDeliverCargoOnThisDay = "20000200183",
  /* Тип вантажу некоректний */
  IncorrectCargoType = "20000200184",
  /* Неправильне значення суми */
  IncorrectSummValue = "20000200185",
  /* Часові інтервали некоректні */
  IncorrectTimeInterval = "20000200186",
  /* Некоректно вказані часові інтервали */
  IncorrectTimeIntervalHour = "20000200187",
  /* Внутрішній номер замовлення клієнта містить недопустимі символи */
  InfoRegClientBarcodesHasInvalidCharacters = "20000200188",
  /* Внутрішній номер замовлення клієнта задовгий */
  InfoRegClientBarcodesTooLong = "20000200189",
  /* Номер інтернет-документа не визначено */
  IntDocNumberUndefined = "20000200190",
  /* Місто міжнародного відправника недійсне */
  InternationalCitySenderInvalid = "20000200191",
  /* Місто міжнародного відправника обов'язкове */
  InternationalCitySenderRequired = "20000200192",
  /* Контакт міжнародного відправника недійсний */
  InternationalContactSenderInvalid = "20000200193",
  /* Контакт міжнародного відправника обов'язковий */
  InternationalContactSenderRequired = "20000200194",
  /* Міжнародний Email недійсний */
  InternationalEmailInvalid = "20000200195",
  /* Міжнародний відправник недійсний */
  InternationalSenderInvalid = "20000200196",
  /* Адреса міжнародного відправника недійсна */
  InternationalSenderAddressInvalid = "20000200197",
  /* Адреса міжнародного відправника обов'язкова */
  InternationalSenderAddressRequired = "20000200198",
  /* Телефон міжнародного відправника недійсний */
  InternationalSendersPhoneInvalid = "20000200199",
  /* Телефон міжнародного відправника обов'язковий */
  InternationalSendersPhoneRequired = "20000200200",
  /* Міжнародна експрес-накладна недійсна */
  InternationalWaybillInvalid = "20000200201",
  /* Міжнародна експрес-накладна обов'язкова */
  InternationalWaybillRequired = "20000200202",
  /* Оголошена вартість недійсна */
  InternationalWaybillPriceInvalid = "20000200203",
  /* Оголошена вартість обов'язкова */
  InternationalWaybillPriceRequired = "20000200204",
  /* Інтернет-документ не знайдено */
  InternetDocumentNotFound = "20000200205",
  /* Інтернет-документ не знайдено власником */
  InternetDocumentNotFoundByOwner = "20000200206",
  /* Доверенность недействительна */
  IsTakeAttorneyUnavailable = "20000200207",
  /* Предмети порожні */
  ItemsEmpty = "20000200208",
  /* Довжина порожня */
  LengthEmpty = "20000400464",
  /* Значення "Довжина" занадто довге */
  LengthTooHigh = "20000200210",
  /* Значення "Довжина" занадто довге для поштомата InPost */
  LengthTooHighForInPost = "20000200211",
  /* Значення "Довжина" занадто довге для поштомата NovaPoshta */
  LengthTooHighForPostomatNP = "20000200212",
  /* Параметр токен торгового майданчику вказано некоректно */
  MarketplacePartnerTokenIncorrect = "20000100541"
}