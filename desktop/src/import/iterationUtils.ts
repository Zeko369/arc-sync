export const iterateOverWeirdArray = <T, K = string>(
  array: (T | string)[],
  callback: (key: K, item: T) => void
) => {
  if (!array) {
    throw new Error("Array is undefined");
  }

  if (!Array.isArray(array)) {
    throw new Error("Array is not an array");
  }

  if (array.length % 2 === 1) {
    throw new Error("Array length must be even");
  }

  for (let i = 0; i < array.length; i += 2) {
    callback(array[i] as K, array[i + 1] as T);
  }
};

export const convertArrayToObj = <T, K extends string = string>(array: T[]) => {
  const obj: Record<K, T> = {} as any;
  iterateOverWeirdArray<T, K>(array, (key, value) => (obj[key] = value));
  return obj;
};
