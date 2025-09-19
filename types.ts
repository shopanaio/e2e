/* eslint-disable @typescript-eslint/array-type */
export type DeepPartial<T> =
  // если T — массив, делаем DeepPartial его элементов
  T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : // иначе, если объект (но не массив), рекурсивно делаем все поля опциональными
      T extends object
      ? { [P in keyof T]?: DeepPartial<T[P]> }
      : // иначе оставляем как есть
        T;
