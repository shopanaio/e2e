### Промпт для AI для добавления новых продуктов

**Задача:** Создать JSON-файлы для новых продуктов в директории `e2e/data/seed-json/products/`.

**Контекст и правила:**

1.  **Имя файла:** Имя файла должно быть в `kebab-case` и соответствовать значению поля `slug` в JSON. Например, для продукта со `slug: "new-cool-product"` имя файла будет `new-cool-product.json`.

2.  **Структура JSON:** Каждый JSON-файл должен строго соответствовать следующей структуре. Обрати внимание на названия полей (`title`, `slug`, `featureGroups`) и типы данных.

    ```json
    {
      "title": "Название продукта",
      "slug": "product-slug-in-kebab-case",
      "description": "Подробное описание продукта.",
      "category": "slug-категории",
      "price": 123.45,
      "tags": ["slug-тега-1", "slug-тега-2"],
      "featureGroups": [
        {
          "slug": "feature-group-slug-1",
          "values": ["Значение 1", "Значение 2"]
        },
        {
          "slug": "feature-group-slug-2",
          "values": ["Другое значение"]
        }
      ],
      "groups": [
        {
          "title": "Название группы",
          "isMultiple": false,
          "isRequired": true,
          "sortIndex": 0,
          "items": [
            {
              "productSlug": "component-product-slug",
              "featureValues": ["Значение характеристики"],
              "sortIndex": 0,
              "priceType": "BASE",
              "priceAmountValue": 100
            }
          ]
        }
      ]
    }
    ```

3.  **Поля:**
    *   `title` (string): Человекочитаемое название продукта.
    *   `slug` (string): Уникальный идентификатор в `kebab-case`. **Должен совпадать с именем файла (без .json)**.
    *   `description` (string): Описание продукта.
    *   `category` (string): `slug` существующей категории. Чтобы узнать доступные категории, посмотри файлы в `e2e/data/seed-json/categories/`.
    *   `price` (number): Цена продукта (число).
    *   `tags` (array of strings): Массив `slug`'ов существующих тегов. Чтобы узнать доступные теги, посмотри файлы в `e2e/data/seed-json/tags/`.
    *   `featureGroups` (array of objects): Массив групп характеристик.
        *   `slug` (string): `slug` существующей группы характеристик. Чтобы узнать доступные группы, посмотри файлы в `e2e/data/seed-json/feature-groups/`.
        *   `values` (array of strings): Массив возможных строковых значений для данной характеристики.
    *   `groups` (array of objects, опционально): Массив групп компонентов для составных продуктов.
        *   `title` (string): Название группы (НЕ используйте поля `slug`, `name` или `required` - они устарели).
        *   `isMultiple` (boolean): Можно ли выбрать несколько компонентов из группы.
        *   `isRequired` (boolean): Обязательна ли группа для выбора.
        *   `sortIndex` (number): Порядок сортировки группы.
        *   `items` (array of objects): Компоненты в группе.
            *   `productSlug` (string): `slug` продукта-компонента.
            *   `featureValues` (array of strings, опционально): Массив значений характеристик для выбора конкретного варианта компонента. Используется для продуктов с `featureGroups`. Порядок значений должен соответствовать порядку `featureGroups` в продукте-компоненте.
              *Пример*: для продукта `pizza-component-sauce` с `featureGroups` содержащим `sauce-type`, чтобы выбрать вариант "Томатный", используйте `"featureValues": ["Томатный"]`.
              *Для продуктов с несколькими характеристиками*: `"featureValues": ["Серый", "Велюр"]` (цвет и материал).
              *Для простых продуктов без характеристик*: не указывайте `featureValues` вообще.
            *   `sortIndex` (number): Порядок сортировки элемента в группе.
            *   `priceType` (string): Тип цены (`BASE`, `FREE`, `BASE_ADJUST_AMOUNT`, `BASE_ADJUST_PERCENT`).
            *   `priceAmountValue` (number, опционально): Значение корректировки цены для `BASE_ADJUST_AMOUNT` (в центах/копейках).
            *   `pricePercentageValue` (number, опционально): Процент корректировки для `BASE_ADJUST_PERCENT`.

4.  **Важно:** Перед созданием нового продукта, **обязательно** изучи существующие файлы в директориях:
    *   `e2e/data/seed-json/products/` (для примера)
    *   `e2e/data/seed-json/categories/` (для доступных категорий)
    *   `e2e/data/seed-json/tags/` (для доступных тегов)
    *   `e2e/data/seed-json/feature-groups/` (для доступных характеристик)

    Это поможет избежать ошибок в структуре и использовать корректные `slug` для категорий, тегов и характеристик.

**Пример запроса:**

> Создай 5 новых продуктов для категории `clothing` в `e2e/data/seed-json/products/`. Используй существующие теги и характеристики.

---

**⚠️ ВАЖНО: Обновленная структура групп**

Если вы видите старые примеры в коде, **НЕ используйте** устаревшие поля:
- ❌ `"slug"` в группах (поле удалено)
- ❌ `"name"` вместо `"title"` в группах
- ❌ `"required"` вместо `"isRequired"` в группах
- ❌ `"variantSlug"` в items (заменено на `"featureValues"`)
- ❌ `"price": {"amount": "..."}` в items (заменено на `"priceType"` + `"priceAmountValue"`)

✅ **Используйте ТОЛЬКО актуальную структуру** из примера выше!
