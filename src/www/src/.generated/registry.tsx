//@ts-nocheck
import { lazy } from "react";
import { IRegistryJSON } from "@/types/registry.types";

const registry = {
  "and": {
    "name": "and",
    "code": {
      "ts": "/**\n * Performs a logical AND operation on the given arguments.\n **/\nconst and = (...args: unknown[]) => {\n  if (args.length === 0) return false;\n  return args.every((arg) => Boolean(arg));\n};\n\nexport default and;\n",
      "js": "/**\n * Performs a logical AND operation on the given arguments.\n **/\nconst and = (...args) => {\n  if (args.length === 0) return false;\n  return args.every((arg) => Boolean(arg));\n};\nexport default and;\n"
    },
    "examples": {},
    "category": "gates",
    "type": "functions"
  },
  "callAfter": {
    "name": "callAfter",
    "code": {
      "ts": "/**\n * Returns a new function that can be called only after calling a specific number of times.\n **/\nconst callAfter = <T, S extends any[]>(\n  fn: (...args: S) => T,\n  count: number,\n): ((...args: S) => T | undefined) => {\n  let counter = 0;\n  return (...args: S): T | undefined => {\n    if (counter < count) {\n      counter++;\n      return undefined;\n    }\n    return fn(...args);\n  };\n};\n\nexport default callAfter;\n",
      "js": "/**\n * Returns a new function that can be called only after calling a specific number of times.\n **/\nconst callAfter = (fn, count) => {\n  let counter = 0;\n  return (...args) => {\n    if (counter < count) {\n      counter++;\n      return undefined;\n    }\n    return fn(...args);\n  };\n};\nexport default callAfter;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "callBefore": {
    "name": "callBefore",
    "code": {
      "ts": "/**\n * Returns a new function that can be called only for specific number of times.\n **/\nconst callBefore = <T, S extends any[]>(\n  fn: (...args: S) => T,\n  count: number,\n): ((...args: S) => T | undefined) => {\n  let counter = 0;\n  return (...args: S): T | undefined => {\n    if (counter < count) {\n      counter++;\n      return fn(...args);\n    }\n    return undefined;\n  };\n};\n\nexport default callBefore;\n",
      "js": "/**\n * Returns a new function that can be called only for specific number of times.\n **/\nconst callBefore = (fn, count) => {\n  let counter = 0;\n  return (...args) => {\n    if (counter < count) {\n      counter++;\n      return fn(...args);\n    }\n    return undefined;\n  };\n};\nexport default callBefore;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "chunk": {
    "name": "chunk",
    "code": {
      "ts": "/**\n * Chunks an array into smaller arrays of a specified size.\n **/\nconst chunk = <T,>(\n  array: T[],\n  size: number,\n  config?: {\n    style: 'normal' | 'repeat' | 'remove';\n  },\n): T[][] => {\n  const result: T[][] = [];\n\n  // Push the chunks into the result array\n  for (let i = 0; i < array.length; i += size) {\n    result.push(array.slice(i, i + size));\n  }\n\n  if (config?.style === 'remove' && result[result.length - 1].length !== size) {\n    result.pop(); // Remove the last chunk if it doesn't match the size\n  } else if (config?.style === 'repeat') {\n    // Repeat elements from the start if the last chunk is smaller\n    const lastChunk = result[result.length - 1];\n    if (lastChunk.length < size) {\n      const elementsNeeded = size - lastChunk.length;\n      const repeatedElements = array.slice(0, elementsNeeded); // Get elements from the start\n      result[result.length - 1] = lastChunk.concat(repeatedElements); // Fill the last chunk\n    }\n  }\n\n  return result;\n};\n\nexport default chunk;\n",
      "js": "/**\n * Chunks an array into smaller arrays of a specified size.\n **/\nconst chunk = (array, size, config) => {\n  const result = [];\n  // Push the chunks into the result array\n  for (let i = 0; i < array.length; i += size) {\n    result.push(array.slice(i, i + size));\n  }\n  if (config?.style === 'remove' && result[result.length - 1].length !== size) {\n    result.pop(); // Remove the last chunk if it doesn't match the size\n  } else if (config?.style === 'repeat') {\n    // Repeat elements from the start if the last chunk is smaller\n    const lastChunk = result[result.length - 1];\n    if (lastChunk.length < size) {\n      const elementsNeeded = size - lastChunk.length;\n      const repeatedElements = array.slice(0, elementsNeeded); // Get elements from the start\n      result[result.length - 1] = lastChunk.concat(repeatedElements); // Fill the last chunk\n    }\n  }\n  return result;\n};\nexport default chunk;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "compact": {
    "name": "compact",
    "code": {
      "ts": "/**\n * Removes falsy values from an array, If extend is true, also removes empty objects and arrays.\n **/\nconst compact = <T,>(array: T[], extend: boolean = false): T[] => {\n  let truthy = array.filter((item) => {\n    // remove all falsy values and excluded values\n    return Boolean(item);\n  });\n\n  if (extend) {\n    // remove all empty objects\n    truthy = truthy.filter((item) => {\n      if (typeof item === 'object' && !(item instanceof Array)) {\n        return Object.keys(item as object).length > 0;\n      }\n      return true;\n    });\n    // remove all empty arrays\n    truthy = truthy.filter((item) => {\n      if (Array.isArray(item)) {\n        return (item as []).length > 0;\n      }\n      return true;\n    });\n  }\n  return truthy;\n};\n\nexport default compact;\n",
      "js": "/**\n * Removes falsy values from an array, If extend is true, also removes empty objects and arrays.\n **/\nconst compact = (array, extend = false) => {\n  let truthy = array.filter((item) => {\n    // remove all falsy values and excluded values\n    return Boolean(item);\n  });\n  if (extend) {\n    // remove all empty objects\n    truthy = truthy.filter((item) => {\n      if (typeof item === 'object' && !(item instanceof Array)) {\n        return Object.keys(item).length > 0;\n      }\n      return true;\n    });\n    // remove all empty arrays\n    truthy = truthy.filter((item) => {\n      if (Array.isArray(item)) {\n        return item.length > 0;\n      }\n      return true;\n    });\n  }\n  return truthy;\n};\nexport default compact;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "count": {
    "name": "count",
    "code": {
      "ts": "/**\n * returns the result of a function and the number of times that function is invoked.\n **/\nconst count = <A extends any[], R>(fn: (...args: A) => R) => {\n  let callCount = 0;\n\n  const wrapper = (...args: A): R => {\n    callCount++;\n    const result = fn(...args);\n    return result;\n  };\n\n  const getCount: () => number = () => callCount;\n  wrapper.getCount = getCount;\n\n  return wrapper;\n};\n\nexport default count;\n",
      "js": "/**\n * returns the result of a function and the number of times that function is invoked.\n **/\nconst count = (fn) => {\n  let callCount = 0;\n  const wrapper = (...args) => {\n    callCount++;\n    const result = fn(...args);\n    return result;\n  };\n  const getCount = () => callCount;\n  wrapper.getCount = getCount;\n  return wrapper;\n};\nexport default count;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "debounce": {
    "name": "debounce",
    "code": {
      "ts": "/**\n * Returns a debounced function that delays invoking the passed function until after `given` milliseconds have elapsed since the last time the debounced function was invoked.\n **/\n\nfunction debounce<A extends unknown[]>(\n  fn: (...args: A) => void,\n  delay: number = 300,\n) {\n  let timer: any;\n  return (...args: A) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}\n\nexport default debounce;\n",
      "js": "/**\n * Returns a debounced function that delays invoking the passed function until after `given` milliseconds have elapsed since the last time the debounced function was invoked.\n **/\nfunction debounce(fn, delay = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}\nexport default debounce;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "filterObj": {
    "name": "filterObj",
    "code": {
      "ts": "/**\n * Same as Array.prototype.filter, but for objects.\n **/\nconst filterObj = <T extends Record<string, unknown>>(\n  obj: T,\n  predicate: (value: T[keyof T], key: keyof T) => boolean,\n): Partial<T> => {\n  const result: Partial<T> = {};\n\n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      if (predicate(obj[key], key)) {\n        result[key] = obj[key]; // Include the property if the predicate returns true\n      }\n    }\n  }\n\n  return result;\n};\n\nexport default filterObj;\n",
      "js": "/**\n * Same as Array.prototype.filter, but for objects.\n **/\nconst filterObj = (obj, predicate) => {\n  const result = {};\n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      if (predicate(obj[key], key)) {\n        result[key] = obj[key]; // Include the property if the predicate returns true\n      }\n    }\n  }\n  return result;\n};\nexport default filterObj;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "getLocalStorageItem": {
    "name": "getLocalStorageItem",
    "code": {
      "ts": "/**\n * Retrieves a value from local storage with optional parsing and a default return.\n **/\ntype GetConfig<Value> =\n  | {\n      defaultParser: boolean;\n    }\n  | ((storedValue: string) => Value);\n\nconst getLocalStorageItem = <Value,>(\n  key: string,\n  defaultValue: Value,\n  config: GetConfig<Value> = {\n    defaultParser: true,\n  },\n): Value => {\n  if (typeof window === 'undefined' || !('localStorage' in window)) {\n    return defaultValue;\n  }\n\n  const storedValue = localStorage.getItem(key);\n  if (!storedValue) return defaultValue;\n\n  try {\n    if (typeof config === 'object' && config.defaultParser) {\n      return JSON.parse(storedValue) as Value;\n    } else if (typeof config === 'function') {\n      return config(storedValue);\n    }\n    return storedValue as unknown as Value;\n  } catch {\n    return defaultValue;\n  }\n};\n\nexport default getLocalStorageItem;\n",
      "js": "const getLocalStorageItem = (\n  key,\n  defaultValue,\n  config = {\n    defaultParser: true,\n  },\n) => {\n  if (typeof window === 'undefined' || !('localStorage' in window)) {\n    return defaultValue;\n  }\n  const storedValue = localStorage.getItem(key);\n  if (!storedValue) return defaultValue;\n  try {\n    if (typeof config === 'object' && config.defaultParser) {\n      return JSON.parse(storedValue);\n    } else if (typeof config === 'function') {\n      return config(storedValue);\n    }\n    return storedValue;\n  } catch {\n    return defaultValue;\n  }\n};\nexport default getLocalStorageItem;\n"
    },
    "examples": {},
    "category": "web-api",
    "type": "functions"
  },
  "insert": {
    "name": "insert",
    "code": {
      "ts": "/**\n * Inserts elements into an array at a specified index.\n **/\nconst insert = <T,>(\n  arr: T[],\n  index: number,\n  [...items]: T[],\n  recursive: boolean = false,\n): T[] => {\n  const isNegativeIndex = index < 0;\n\n  if (isNegativeIndex) {\n    throw new Error('Negative index is not supported!');\n  }\n\n  if (!recursive) {\n    const newArr = [...arr.slice(0, index), ...items, ...arr.slice(index)];\n    return newArr;\n  } else {\n    const shouldInsert = Math.floor(arr.length / index);\n    let newArr = [...arr];\n    for (let i = 0; i < shouldInsert; i++) {\n      const insertIndex = (i + 1) * index + i * items.length;\n      newArr = [\n        ...newArr.slice(0, insertIndex),\n        ...items,\n        ...newArr.slice(insertIndex),\n      ];\n    }\n    return newArr;\n  }\n};\n\nexport default insert;\n",
      "js": "/**\n * Inserts elements into an array at a specified index.\n **/\nconst insert = (arr, index, [...items], recursive = false) => {\n  const isNegativeIndex = index < 0;\n  if (isNegativeIndex) {\n    throw new Error('Negative index is not supported!');\n  }\n  if (!recursive) {\n    const newArr = [...arr.slice(0, index), ...items, ...arr.slice(index)];\n    return newArr;\n  } else {\n    const shouldInsert = Math.floor(arr.length / index);\n    let newArr = [...arr];\n    for (let i = 0; i < shouldInsert; i++) {\n      const insertIndex = (i + 1) * index + i * items.length;\n      newArr = [\n        ...newArr.slice(0, insertIndex),\n        ...items,\n        ...newArr.slice(insertIndex),\n      ];\n    }\n    return newArr;\n  }\n};\nexport default insert;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "mapObj": {
    "name": "mapObj",
    "code": {
      "ts": "/**\n * Same as Array.prototype.map, but for objects.\n **/\nconst mapObj = <T, U>(\n  obj: Record<string, T>,\n  callback: (value: T, key: string, obj: Record<string, T>) => U,\n): Record<string, U> => {\n  const result: Record<string, U> = {};\n\n  // loop through each key in the object\n  for (const key in obj) {\n    // check if the key is a property of the object\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      result[key] = callback(obj[key], key, obj);\n    }\n  }\n\n  return result;\n};\n\nexport default mapObj;\n",
      "js": "/**\n * Same as Array.prototype.map, but for objects.\n **/\nconst mapObj = (obj, callback) => {\n  const result = {};\n  // loop through each key in the object\n  for (const key in obj) {\n    // check if the key is a property of the object\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      result[key] = callback(obj[key], key, obj);\n    }\n  }\n  return result;\n};\nexport default mapObj;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "nTimes": {
    "name": "nTimes",
    "code": {
      "ts": "/**\n * Calls a function n times and returns an array of the results.\n **/\n\n/**\n * Calls a function n times and returns an array of the results.\n **/\n\nconst nTimes = <T,>(fn: (i: number) => T, n: number = 1): T[] => {\n  if (n < 0) {\n    throw new Error('n must be greater than 0');\n  }\n  let result: T[] = [];\n  for (let i = 0; i < n; i++) {\n    result.push(fn(i));\n  }\n  return result;\n};\n\nexport default nTimes;\n",
      "js": "/**\n * Calls a function n times and returns an array of the results.\n **/\n/**\n * Calls a function n times and returns an array of the results.\n **/\nconst nTimes = (fn, n = 1) => {\n  if (n < 0) {\n    throw new Error('n must be greater than 0');\n  }\n  let result = [];\n  for (let i = 0; i < n; i++) {\n    result.push(fn(i));\n  }\n  return result;\n};\nexport default nTimes;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "nand": {
    "name": "nand",
    "code": {
      "ts": "/**\n * Performs a logical NAND operation on the given arguments.\n **/\n\nconst nand = (...args: unknown[]) => {\n  if (args.length === 0) return false;\n  const and = args.every((arg) => Boolean(arg));\n  return !and;\n};\n\nexport default nand;\n",
      "js": "/**\n * Performs a logical NAND operation on the given arguments.\n **/\nconst nand = (...args) => {\n  if (args.length === 0) return false;\n  const and = args.every((arg) => Boolean(arg));\n  return !and;\n};\nexport default nand;\n"
    },
    "examples": {},
    "category": "gates",
    "type": "functions"
  },
  "nor": {
    "name": "nor",
    "code": {
      "ts": "/**\n * Performs a logical NOR operation on the given arguments.\n **/\nconst nor = (...args: unknown[]) => {\n  if (args.length === 0) return false;\n  const or = args.some((arg) => Boolean(arg));\n  return !or;\n};\n\nexport default nor;\n",
      "js": "/**\n * Performs a logical NOR operation on the given arguments.\n **/\nconst nor = (...args) => {\n  if (args.length === 0) return false;\n  const or = args.some((arg) => Boolean(arg));\n  return !or;\n};\nexport default nor;\n"
    },
    "examples": {},
    "category": "gates",
    "type": "functions"
  },
  "omit": {
    "name": "omit",
    "code": {
      "ts": "/**\n * Returns a new object with the specified keys omitted.\n **/\nconst omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {\n  const newObj = { ...obj };\n  keys.forEach((key) => delete newObj[key]);\n  return newObj as Omit<T, K>;\n};\n\nexport default omit;\n",
      "js": "/**\n * Returns a new object with the specified keys omitted.\n **/\nconst omit = (obj, keys) => {\n  const newObj = { ...obj };\n  keys.forEach((key) => delete newObj[key]);\n  return newObj;\n};\nexport default omit;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "once": {
    "name": "once",
    "code": {
      "ts": "/**\n * Returns a new function that can be called only once.\n **/\nconst once = <T, S extends any[]>(\n  fn: (...args: S) => T,\n): ((...args: S) => T | undefined) => {\n  let isCalled = false;\n  return (...args: S): T | undefined => {\n    if (!isCalled) {\n      isCalled = true;\n      return fn(...args);\n    }\n    return undefined;\n  };\n};\n\nexport default once;\n",
      "js": "/**\n * Returns a new function that can be called only once.\n **/\nconst once = (fn) => {\n  let isCalled = false;\n  return (...args) => {\n    if (!isCalled) {\n      isCalled = true;\n      return fn(...args);\n    }\n    return undefined;\n  };\n};\nexport default once;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "or": {
    "name": "or",
    "code": {
      "ts": "/**\n * Performs a logical OR operation on the given arguments.\n **/\nconst or = (...args: unknown[]) => {\n  return args.some((arg) => Boolean(arg));\n};\n\nexport default or;\n",
      "js": "/**\n * Performs a logical OR operation on the given arguments.\n **/\nconst or = (...args) => {\n  return args.some((arg) => Boolean(arg));\n};\nexport default or;\n"
    },
    "examples": {},
    "category": "gates",
    "type": "functions"
  },
  "partition": {
    "name": "partition",
    "code": {
      "ts": "/**\n * Partitions an array into two arrays based on a given callback ie predicate.\n **/\nconst partition = <T,>(\n  arr: T[],\n  predicate: (value: T, i: number, arr: T[]) => boolean,\n): [T[], T[]] => {\n  const pass: T[] = [];\n  const fail: T[] = [];\n  arr.forEach((...args) => {\n    // run the predicate function on each element in the array\n    // and push the element to the appropriate array\n    (predicate(...args) ? pass : fail).push(args[0]);\n  });\n  return [pass, fail];\n};\n\nexport default partition;\n",
      "js": "/**\n * Partitions an array into two arrays based on a given callback ie predicate.\n **/\nconst partition = (arr, predicate) => {\n  const pass = [];\n  const fail = [];\n  arr.forEach((...args) => {\n    // run the predicate function on each element in the array\n    // and push the element to the appropriate array\n    (predicate(...args) ? pass : fail).push(args[0]);\n  });\n  return [pass, fail];\n};\nexport default partition;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "pick": {
    "name": "pick",
    "code": {
      "ts": "/**\n * Picks the specified keys from an object.\n **/\nconst pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {\n  const newObj: any = {};\n  keys.forEach((key) => {\n    newObj[key] = obj[key];\n  });\n  return newObj as Pick<T, K>;\n};\n\nexport default pick;\n",
      "js": "/**\n * Picks the specified keys from an object.\n **/\nconst pick = (obj, keys) => {\n  const newObj = {};\n  keys.forEach((key) => {\n    newObj[key] = obj[key];\n  });\n  return newObj;\n};\nexport default pick;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "remove": {
    "name": "remove",
    "code": {
      "ts": "/**\n * Removes elements from an array at a specified index.\n **/\nconst remove = <T,>(array: T[], index: number | number[]): T[] => {\n  const len = array.length;\n  if (Array.isArray(index)) {\n    // convert negative indices to their positive counterparts\n    const indices = index.map((i) => (i < 0 ? len + i : i));\n    return array.filter((_, i) => !indices.includes(i));\n  }\n  index = index < 0 ? len + index : index;\n  return array.filter((_, i) => i !== index);\n};\n\nexport default remove;\n",
      "js": "/**\n * Removes elements from an array at a specified index.\n **/\nconst remove = (array, index) => {\n  const len = array.length;\n  if (Array.isArray(index)) {\n    // convert negative indices to their positive counterparts\n    const indices = index.map((i) => (i < 0 ? len + i : i));\n    return array.filter((_, i) => !indices.includes(i));\n  }\n  index = index < 0 ? len + index : index;\n  return array.filter((_, i) => i !== index);\n};\nexport default remove;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "renameKeys": {
    "name": "renameKeys",
    "code": {
      "ts": "/**\n * Renames keys in an object.\n **/\nconst renameKeys = <\n  T extends Record<string, unknown>,\n  K extends keyof T,\n  N extends string,\n>(\n  obj: T,\n  keys: Array<{ old: K; new: N }>,\n): Omit<T, K> & Record<N, T[K]> => {\n  const newObj: Record<string, unknown> = { ...obj };\n\n  keys.forEach(({ old: oldKey, new: newKey }) => {\n    // Only rename if the old key exists in the object\n    if (oldKey in newObj) {\n      newObj[newKey] = newObj[oldKey as string];\n      delete newObj[oldKey as string];\n    }\n  });\n\n  return newObj as Omit<T, K> & Record<N, T[K]>;\n};\n\nexport default renameKeys;\n",
      "js": "/**\n * Renames keys in an object.\n **/\nconst renameKeys = (obj, keys) => {\n  const newObj = { ...obj };\n  keys.forEach(({ old: oldKey, new: newKey }) => {\n    // Only rename if the old key exists in the object\n    if (oldKey in newObj) {\n      newObj[newKey] = newObj[oldKey];\n      delete newObj[oldKey];\n    }\n  });\n  return newObj;\n};\nexport default renameKeys;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "renameKeysByCallback": {
    "name": "renameKeysByCallback",
    "code": {
      "ts": "/**\n * Renames keys in an object using a given callback function.\n **/\nconst renameKeysByCallback = <\n  T extends Record<string, unknown>,\n  R extends Record<string, any>,\n>(\n  obj: T,\n  cb: (key: keyof T) => string,\n): R => {\n  const newObj: Record<string, any> = { ...obj };\n\n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      const newKey = cb(key);\n      if (newKey) {\n        newObj[newKey] = obj[key]; // Assign the value to the new key\n        delete newObj[key]; // Delete the old key\n      }\n    }\n  }\n\n  return newObj as R;\n};\n\nexport default renameKeysByCallback;\n",
      "js": "/**\n * Renames keys in an object using a given callback function.\n **/\nconst renameKeysByCallback = (obj, cb) => {\n  const newObj = { ...obj };\n  for (const key in obj) {\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      const newKey = cb(key);\n      if (newKey) {\n        newObj[newKey] = obj[key]; // Assign the value to the new key\n        delete newObj[key]; // Delete the old key\n      }\n    }\n  }\n  return newObj;\n};\nexport default renameKeysByCallback;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "retry": {
    "name": "retry",
    "code": {
      "ts": "/**\n * Retries the given function a specified number of times with a delay between each retry.\n **/\nconst retry = async <T,>(\n  fn: Function,\n  retries: number = 3,\n  delay: number = 1000,\n): Promise<T> => {\n  try {\n    return await fn();\n  } catch (error) {\n    if (retries > 0) {\n      await new Promise((resolve) => setTimeout(resolve, delay));\n      return retry(fn, retries - 1, delay);\n    }\n    throw error;\n  }\n};\n\nexport default retry;\n",
      "js": "/**\n * Retries the given function a specified number of times with a delay between each retry.\n **/\nconst retry = async (fn, retries = 3, delay = 1000) => {\n  try {\n    return await fn();\n  } catch (error) {\n    if (retries > 0) {\n      await new Promise((resolve) => setTimeout(resolve, delay));\n      return retry(fn, retries - 1, delay);\n    }\n    throw error;\n  }\n};\nexport default retry;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "rotate": {
    "name": "rotate",
    "code": {
      "ts": "/**\n * Rotates the elements of an array by a given number of positions.\n **/\nconst rotate = <T,>(\n  arr: T[],\n  n: number,\n  dir: 'left' | 'right' = 'left',\n): T[] => {\n  if (dir === 'left') {\n    return arr.slice(n, arr.length).concat(arr.slice(0, n));\n  } else {\n    return arr\n      .slice(arr.length - n, arr.length)\n      .concat(arr.slice(0, arr.length - n));\n  }\n};\n\nexport default rotate;\n",
      "js": "/**\n * Rotates the elements of an array by a given number of positions.\n **/\nconst rotate = (arr, n, dir = 'left') => {\n  if (dir === 'left') {\n    return arr.slice(n, arr.length).concat(arr.slice(0, n));\n  } else {\n    return arr\n      .slice(arr.length - n, arr.length)\n      .concat(arr.slice(0, arr.length - n));\n  }\n};\nexport default rotate;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "sampleArr": {
    "name": "sampleArr",
    "code": {
      "ts": "/**\n * Generates an array of random numbers.\n **/\nconst sampleArr = (size: number) => {\n  if (size < 0) throw new Error('Size must be a positive number');\n  return Array.from({ length: size }, (_, i) => Math.floor(Math.random() * i));\n};\n\nexport default sampleArr;\n",
      "js": "/**\n * Generates an array of random numbers.\n **/\nconst sampleArr = (size) => {\n  if (size < 0) throw new Error('Size must be a positive number');\n  return Array.from({ length: size }, (_, i) => Math.floor(Math.random() * i));\n};\nexport default sampleArr;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "sampleObj": {
    "name": "sampleObj",
    "code": {
      "ts": "/**\n * Returns a sample object with the specified keys and values as random numbers.\n **/\nconst sampleObj = <R extends Record<string | number | symbol, number>>(\n  ...keys: string[]\n) => {\n  const obj: any = {};\n  keys.forEach((key) => {\n    obj[key] = Math.random();\n  });\n  return obj as R | Record<string, number>;\n};\n\nexport default sampleObj;\n",
      "js": "/**\n * Returns a sample object with the specified keys and values as random numbers.\n **/\nconst sampleObj = (...keys) => {\n  const obj = {};\n  keys.forEach((key) => {\n    obj[key] = Math.random();\n  });\n  return obj;\n};\nexport default sampleObj;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "setLocalStorageItem": {
    "name": "setLocalStorageItem",
    "code": {
      "ts": "/**\n * Stores a value in local storage with optional parsing.\n **/\ntype Config<Value> =\n  | {\n      defaultParser: boolean;\n    }\n  | ((value: Value) => string);\n\nconst setLocalStorageItem = <Value,>(\n  key: string,\n  value: unknown,\n  config: Config<Value> = {\n    defaultParser: true,\n  },\n): boolean => {\n  if (typeof window === 'undefined' || !('localStorage' in window)) {\n    return false;\n  }\n\n  try {\n    let parsed: string = '';\n    if (typeof config === 'object' && config.defaultParser) {\n      if (typeof value === 'object' || Array.isArray(value)) {\n        parsed = JSON.stringify(value);\n      } else {\n        parsed = value as string;\n      }\n    } else if (typeof config === 'function') {\n      parsed = config(value as Value);\n    } else {\n      parsed = value as string;\n    }\n    localStorage.setItem(key, parsed);\n    return true;\n  } catch {\n    return false;\n  }\n};\n\nexport default setLocalStorageItem;\n",
      "js": "const setLocalStorageItem = (\n  key,\n  value,\n  config = {\n    defaultParser: true,\n  },\n) => {\n  if (typeof window === 'undefined' || !('localStorage' in window)) {\n    return false;\n  }\n  try {\n    let parsed = '';\n    if (typeof config === 'object' && config.defaultParser) {\n      if (typeof value === 'object' || Array.isArray(value)) {\n        parsed = JSON.stringify(value);\n      } else {\n        parsed = value;\n      }\n    } else if (typeof config === 'function') {\n      parsed = config(value);\n    } else {\n      parsed = value;\n    }\n    localStorage.setItem(key, parsed);\n    return true;\n  } catch {\n    return false;\n  }\n};\nexport default setLocalStorageItem;\n"
    },
    "examples": {},
    "category": "web-api",
    "type": "functions"
  },
  "shuffleArr": {
    "name": "shuffleArr",
    "code": {
      "ts": "/**\n * Shuffles the elements of an array using Fisher-Yates algorithm.\n **/\nconst shuffleArr = <T,>(arr: T[]) => {\n  const copy = [...arr];\n  for (let i = copy.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [copy[i], copy[j]] = [copy[j], copy[i]];\n  }\n\n  return copy;\n};\n\nexport default shuffleArr;\n",
      "js": "/**\n * Shuffles the elements of an array using Fisher-Yates algorithm.\n **/\nconst shuffleArr = (arr) => {\n  const copy = [...arr];\n  for (let i = copy.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [copy[i], copy[j]] = [copy[j], copy[i]];\n  }\n  return copy;\n};\nexport default shuffleArr;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "sleep": {
    "name": "sleep",
    "code": {
      "ts": "/**\n * Sleeps the execution for the specified number of milliseconds.\n **/\nconst sleep = (ms: number): Promise<true> => {\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve(true);\n    }, ms);\n  });\n};\n\nexport default sleep;\n",
      "js": "/**\n * Sleeps the execution for the specified number of milliseconds.\n **/\nconst sleep = (ms) => {\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve(true);\n    }, ms);\n  });\n};\nexport default sleep;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "sortObjKeys": {
    "name": "sortObjKeys",
    "code": {
      "ts": "/**\n * Sorts the keys of an object in ascending or descending order.\n *\n * @template T - The type of the object.\n * @param {T} obj - The object whose keys are to be sorted.\n * @param {boolean} [ascending=true] - Whether to sort the keys in ascending order. Defaults to true.\n * @returns {{ [K in keyof T]: T[K] }} - A new object with sorted keys.\n */\nconst sortObjKeys = <T extends object>(\n  obj: T,\n  ascending: boolean = true,\n): { [K in keyof T]: T[K] } => {\n  return Object.fromEntries(\n    Object.entries(obj).sort(([a], [b]) =>\n      ascending ? a.localeCompare(b) : b.localeCompare(a),\n    ),\n  ) as { [K in keyof T]: T[K] };\n};\n\nexport default sortObjKeys;\n",
      "js": "/**\n * Sorts the keys of an object in ascending or descending order.\n *\n * @template T - The type of the object.\n * @param {T} obj - The object whose keys are to be sorted.\n * @param {boolean} [ascending=true] - Whether to sort the keys in ascending order. Defaults to true.\n * @returns {{ [K in keyof T]: T[K] }} - A new object with sorted keys.\n */\nconst sortObjKeys = (obj, ascending = true) => {\n  return Object.fromEntries(\n    Object.entries(obj).sort(([a], [b]) =>\n      ascending ? a.localeCompare(b) : b.localeCompare(a),\n    ),\n  );\n};\nexport default sortObjKeys;\n"
    },
    "examples": {},
    "category": "objects",
    "type": "functions"
  },
  "throttle": {
    "name": "throttle",
    "code": {
      "ts": "/**\n * Return a throttled function that invokes the passed function at most once per every `given` milliseconds.\n **/\n\nfunction throttle<A extends any[]>(\n  fn: (...args: A) => void,\n  limit: number,\n): (...args: A) => void {\n  let lastCall = 0;\n  return (...args: A) => {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      fn(...args);\n    }\n  };\n}\n\nexport default throttle;\n",
      "js": "/**\n * Return a throttled function that invokes the passed function at most once per every `given` milliseconds.\n **/\nfunction throttle(fn, limit) {\n  let lastCall = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - lastCall >= limit) {\n      lastCall = now;\n      fn(...args);\n    }\n  };\n}\nexport default throttle;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "timeout": {
    "name": "timeout",
    "code": {
      "ts": "/**\n * The timeout function wraps a function with a timeout. If the function does not complete within the specified time, the promise will be rejected.\n **/\nconst timeout = <Return, Err>(\n  fn: (...args: any[]) => Return,\n  time: number,\n  errCb?: (...args: any[]) => Err,\n): ((...args: any[]) => Promise<Return>) => {\n  return (...args: any[]) => {\n    return new Promise<any>((resolve, reject) => {\n      const timer = setTimeout(() => {\n        if (errCb) reject(errCb(...args));\n        else {\n          reject(new Error('Function timed out'));\n        }\n      }, time);\n\n      // Wrap fn call in Promise.resolve to handle both sync and async functions\n      Promise.resolve(fn(...args))\n        .then((result: Return) => {\n          clearTimeout(timer);\n          resolve(result);\n        })\n        .catch((err: Err) => {\n          clearTimeout(timer);\n          reject(err);\n        });\n    });\n  };\n};\n\nexport default timeout;\n",
      "js": "/**\n * The timeout function wraps a function with a timeout. If the function does not complete within the specified time, the promise will be rejected.\n **/\nconst timeout = (fn, time, errCb) => {\n  return (...args) => {\n    return new Promise((resolve, reject) => {\n      const timer = setTimeout(() => {\n        if (errCb) reject(errCb(...args));\n        else {\n          reject(new Error('Function timed out'));\n        }\n      }, time);\n      // Wrap fn call in Promise.resolve to handle both sync and async functions\n      Promise.resolve(fn(...args))\n        .then((result) => {\n          clearTimeout(timer);\n          resolve(result);\n        })\n        .catch((err) => {\n          clearTimeout(timer);\n          reject(err);\n        });\n    });\n  };\n};\nexport default timeout;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "tryCatch": {
    "name": "tryCatch",
    "code": {
      "ts": "/**\n * Helps to safely execute synchronous functions\n **/\ntype TryCatchReturn<Err, Return> = [Err, undefined] | [undefined, Return];\n\nconst tryCatch = <Err extends Error, Return>(\n  fn: () => Return,\n): TryCatchReturn<Err, Return> => {\n  let data: Return | undefined = undefined;\n  let err: Err | undefined = undefined;\n\n  try {\n    data = fn();\n  } catch (error) {\n    err = error as Err;\n  }\n  return [err, data] as TryCatchReturn<Err, Return>;\n};\n\nexport default tryCatch;\n",
      "js": "const tryCatch = (fn) => {\n  let data = undefined;\n  let err = undefined;\n  try {\n    data = fn();\n  } catch (error) {\n    err = error;\n  }\n  return [err, data];\n};\nexport default tryCatch;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "tryCatchAsync": {
    "name": "tryCatchAsync",
    "code": {
      "ts": "/**\n * Helps to safely execute asynchronous functions\n **/\n\ntype TryCatchReturnAsync<Err, Return> = Promise<\n  [Err, undefined] | [undefined, Return]\n>;\n\nconst tryCatchAsync = async <Err extends Error, Return>(\n  fn: () => Promise<Return>,\n): TryCatchReturnAsync<Err, Return> => {\n  try {\n    const result = await fn();\n    return [undefined, result] as [undefined, Return];\n  } catch (error) {\n    return [error as Err, undefined] as [Err, undefined];\n  }\n};\n\nexport default tryCatchAsync;\n",
      "js": "/**\n * Helps to safely execute asynchronous functions\n **/\nconst tryCatchAsync = async (fn) => {\n  try {\n    const result = await fn();\n    return [undefined, result];\n  } catch (error) {\n    return [error, undefined];\n  }\n};\nexport default tryCatchAsync;\n"
    },
    "examples": {},
    "category": "functional",
    "type": "functions"
  },
  "unique": {
    "name": "unique",
    "code": {
      "ts": "/**\n * Creates a unique array from the input array.\n **/\nconst unique = <T,>(arr: T[]): T[] => {\n  return [...new Set(arr)];\n};\n\nexport default unique;\n",
      "js": "/**\n * Creates a unique array from the input array.\n **/\nconst unique = (arr) => {\n  return [...new Set(arr)];\n};\nexport default unique;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  },
  "useBoolean": {
    "name": "useBoolean",
    "code": {
      "ts": "/**\n * hook for managing a boolean state, providing easy functions to set the state to true, false, or toggle its value.\n **/\nimport { useCallback, useState } from 'react';\n\nimport type { Dispatch, SetStateAction } from 'react';\n\ntype UseBooleanReturn = {\n  value: boolean;\n  setValue: Dispatch<SetStateAction<boolean>>;\n  setTrue: () => void;\n  setFalse: () => void;\n  toggle: () => void;\n};\n\nconst useBoolean = (defaultValue = false): UseBooleanReturn => {\n  if (typeof defaultValue !== 'boolean') {\n    throw new Error('defaultValue must be `true` or `false`');\n  }\n\n  const [value, setValue] = useState(defaultValue);\n\n  const setTrue = useCallback(() => {\n    setValue(true);\n  }, []);\n\n  const setFalse = useCallback(() => {\n    setValue(false);\n  }, []);\n\n  const toggle = useCallback(() => {\n    setValue((x) => !x);\n  }, []);\n\n  return { value, setValue, setTrue, setFalse, toggle };\n};\n\nexport default useBoolean;\n",
      "js": "/**\n * hook for managing a boolean state, providing easy functions to set the state to true, false, or toggle its value.\n **/\nimport { useCallback, useState } from 'react';\nconst useBoolean = (defaultValue = false) => {\n  if (typeof defaultValue !== 'boolean') {\n    throw new Error('defaultValue must be `true` or `false`');\n  }\n  const [value, setValue] = useState(defaultValue);\n  const setTrue = useCallback(() => {\n    setValue(true);\n  }, []);\n  const setFalse = useCallback(() => {\n    setValue(false);\n  }, []);\n  const toggle = useCallback(() => {\n    setValue((x) => !x);\n  }, []);\n  return { value, setValue, setTrue, setFalse, toggle };\n};\nexport default useBoolean;\n"
    },
    "examples": {
      "toggle-component": {
        "component": lazy(() => import("@/registry/react-hooks/state/useBoolean/toggle-component.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React from 'react';\nimport useBoolean from '.';\nimport { Button } from '@/components/ui/button';\n\nconst ToggleComponent = () => {\n  const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);\n\n  return (\n    <div className=\"flex flex-col gap-4\">\n      <p>\n        The current state is:{' '}\n        <span className=\"text-destructive\">{String(value)}</span>\n      </p>\n\n      <div className=\"flex gap-4\">\n        <Button variant={'secondary'} onClick={setTrue}>\n          Set True\n        </Button>\n        <Button variant={'secondary'} onClick={setFalse}>\n          Set False\n        </Button>\n        <Button variant={'secondary'} onClick={toggle}>\n          Toggle\n        </Button>\n      </div>\n\n      {/* Demonstrating direct state manipulation */}\n      <div className=\"flex gap-4\">\n        <Button variant={'secondary'} onClick={() => setValue(true)}>\n          Directly Set True\n        </Button>\n        <Button variant={'secondary'} onClick={() => setValue(false)}>\n          Directly Set False\n        </Button>\n      </div>\n    </div>\n  );\n};\n\nexport default ToggleComponent;\n"
        }
      }
    },
    "category": "state",
    "type": "react-hooks"
  },
  "useClickAnywhere": {
    "name": "useClickAnywhere",
    "code": {
      "ts": "import React, { useEffect, useState } from 'react';\n\nexport type UseClickAnywhereReturn = {\n  enable: () => void;\n  disable: () => void;\n  isEnabled: boolean;\n};\n\n/**\n * listens for clicks outside specified elements and triggers a callback, with options to enable/disable the listener and handle multiple refs to ignore.\n */\nconst useClickAnywhere = (\n  callback: (event: MouseEvent) => void,\n  autoEnable: boolean = true,\n  ignoreRefs: React.RefObject<HTMLElement>[] = [],\n): UseClickAnywhereReturn => {\n  const [enabled, setEnabled] = useState(autoEnable);\n\n  useEffect(() => {\n    // Function to handle the click event\n    const handleClick = (event: MouseEvent) => {\n      // Check if the click is inside any of the ignored elements (refs)\n      const isInsideIgnoredElement = ignoreRefs.some((ref) =>\n        ref.current ? ref.current.contains(event.target as Node) : false,\n      );\n\n      if (isInsideIgnoredElement || !enabled) return;\n\n      // Trigger the callback when clicking outside the ignored areas\n      callback(event);\n    };\n\n    if (enabled) {\n      // Attach the event listener to the document\n      document.addEventListener('click', handleClick);\n    }\n\n    // Cleanup: Remove the event listener when the component is unmounted or dependencies change\n    return () => {\n      document.removeEventListener('click', handleClick);\n    };\n  }, [callback, enabled]);\n\n  // Functions to enable and disable the event listener\n  const enable = () => setEnabled(true);\n  const disable = () => setEnabled(false);\n\n  return { enable, disable, isEnabled: enabled };\n};\n\nexport default useClickAnywhere;\n",
      "js": "import { useEffect, useState } from 'react';\n/**\n * listens for clicks outside specified elements and triggers a callback, with options to enable/disable the listener and handle multiple refs to ignore.\n */\nconst useClickAnywhere = (callback, autoEnable = true, ignoreRefs = []) => {\n  const [enabled, setEnabled] = useState(autoEnable);\n  useEffect(() => {\n    // Function to handle the click event\n    const handleClick = (event) => {\n      // Check if the click is inside any of the ignored elements (refs)\n      const isInsideIgnoredElement = ignoreRefs.some((ref) =>\n        ref.current ? ref.current.contains(event.target) : false,\n      );\n      if (isInsideIgnoredElement || !enabled) return;\n      // Trigger the callback when clicking outside the ignored areas\n      callback(event);\n    };\n    if (enabled) {\n      // Attach the event listener to the document\n      document.addEventListener('click', handleClick);\n    }\n    // Cleanup: Remove the event listener when the component is unmounted or dependencies change\n    return () => {\n      document.removeEventListener('click', handleClick);\n    };\n  }, [callback, enabled]);\n  // Functions to enable and disable the event listener\n  const enable = () => setEnabled(true);\n  const disable = () => setEnabled(false);\n  return { enable, disable, isEnabled: enabled };\n};\nexport default useClickAnywhere;\n"
    },
    "examples": {
      "click-anywhere": {
        "component": lazy(() => import("@/registry/react-hooks/web-api/useClickAnywhere/click-anywhere.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React, { useState, useRef, useEffect } from 'react';\nimport useClickAnywhere from '.';\nimport { Button } from '@/components/ui/button';\n\nconst ClickAnywhereComponent: React.FC = () => {\n  const [clickTime, setClickTime] = useState<string | null>(null);\n  const [clickCount, setClickCount] = useState<number>(0);\n  const [status, setStatus] = useState<string>('Disabled');\n  const boxRef = useRef<HTMLDivElement>(null);\n\n  // Callback function for handling the click event\n  const handleClickAnywhere = (event: MouseEvent) => {\n    setClickTime(new Date().toLocaleTimeString());\n    setClickCount((prev) => prev + 1);\n  };\n\n  // Use the custom hook with autoEnable set to true\n  const { enable, disable, isEnabled } = useClickAnywhere(\n    handleClickAnywhere,\n    false,\n    [boxRef],\n  );\n\n  // Toggle the status message based on the `enabled` state\n  useEffect(() => {\n    setStatus(isEnabled ? 'Enabled' : 'Disabled');\n  }, [isEnabled]);\n\n  return (\n    <div>\n      <div\n        ref={boxRef}\n        className=\"py-4 px-6 bg-muted border border-muted-foreground rounded-lg mb-4\"\n      >\n        <p>This is Box 1. Click outside to trigger the event!</p>\n      </div>\n\n      <p>Status: {status}</p>\n      <p>Last clicked at: {clickTime ? clickTime : 'No clicks yet'}</p>\n      <p>Total Clicks: {clickCount}</p>\n\n      <div className=\"mt-4 flex items-center gap-4\">\n        <Button variant={'outline'} size={'sm'} onClick={enable}>\n          Enable Click Detection\n        </Button>\n        <Button variant={'outline'} size={'sm'} onClick={disable}>\n          Disable Click Detection\n        </Button>\n      </div>\n    </div>\n  );\n};\n\nexport default ClickAnywhereComponent;\n"
        }
      }
    },
    "category": "web-api",
    "type": "react-hooks"
  },
  "useCounter": {
    "name": "useCounter",
    "code": {
      "ts": "import { useCallback, useState } from 'react';\n\nimport type { Dispatch, SetStateAction } from 'react';\n\ntype UseCounterReturn = {\n  count: number;\n  increment: () => void;\n  decrement: () => void;\n  reset: () => void;\n  setCount: Dispatch<SetStateAction<number>>;\n};\n\n/**\n * Custom hook that manages a counter with increment, decrement, reset, and setCount functionalities.\n */\nconst useCounter = (\n  initialValue?: number,\n  config?: Partial<{\n    min: number;\n    max: number;\n    step: number;\n  }>,\n): UseCounterReturn => {\n  const [count, setCountFromUseState] = useState(initialValue ?? 0);\n\n  if (\n    config &&\n    typeof config.min === 'number' &&\n    typeof config.max === 'number' &&\n    config.min >= config.max &&\n    config.max <= config.min\n  ) {\n    throw new Error(\n      'min must be less than max and max must be greater than min',\n    );\n  }\n\n  const setCount = useCallback(\n    (value: SetStateAction<number>) => {\n      setCountFromUseState((prev) => {\n        const newValue = typeof value === 'function' ? value(prev) : value;\n\n        if (config?.min !== undefined && newValue < config.min) {\n          return config.min;\n        }\n\n        if (config?.max !== undefined && newValue > config.max) {\n          return config.max;\n        }\n\n        return newValue;\n      });\n    },\n    [config],\n  );\n\n  const increment = useCallback(() => {\n    setCount((x) => x + (config?.step ?? 1));\n  }, [config?.step]);\n\n  const decrement = useCallback(() => {\n    setCount((x) => x - (config?.step ?? 1));\n  }, [config?.step]);\n\n  const reset = useCallback(() => {\n    setCount(initialValue ?? 0);\n  }, [initialValue]);\n\n  return {\n    count,\n    increment,\n    decrement,\n    reset,\n    setCount,\n  };\n};\n\nexport default useCounter;\n",
      "js": "import { useCallback, useState } from 'react';\n/**\n * Custom hook that manages a counter with increment, decrement, reset, and setCount functionalities.\n */\nconst useCounter = (initialValue, config) => {\n  const [count, setCountFromUseState] = useState(initialValue ?? 0);\n  if (\n    config &&\n    typeof config.min === 'number' &&\n    typeof config.max === 'number' &&\n    config.min >= config.max &&\n    config.max <= config.min\n  ) {\n    throw new Error(\n      'min must be less than max and max must be greater than min',\n    );\n  }\n  const setCount = useCallback(\n    (value) => {\n      setCountFromUseState((prev) => {\n        const newValue = typeof value === 'function' ? value(prev) : value;\n        if (config?.min !== undefined && newValue < config.min) {\n          return config.min;\n        }\n        if (config?.max !== undefined && newValue > config.max) {\n          return config.max;\n        }\n        return newValue;\n      });\n    },\n    [config],\n  );\n  const increment = useCallback(() => {\n    setCount((x) => x + (config?.step ?? 1));\n  }, [config?.step]);\n  const decrement = useCallback(() => {\n    setCount((x) => x - (config?.step ?? 1));\n  }, [config?.step]);\n  const reset = useCallback(() => {\n    setCount(initialValue ?? 0);\n  }, [initialValue]);\n  return {\n    count,\n    increment,\n    decrement,\n    reset,\n    setCount,\n  };\n};\nexport default useCounter;\n"
    },
    "examples": {
      "counter-component": {
        "component": lazy(() => import("@/registry/react-hooks/state/useCounter/counter-component.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React from 'react';\nimport useCounter from '.';\nimport { Button } from '@/components/ui/button';\n\nconst CounterComponent = () => {\n  const { count, increment, decrement, reset } = useCounter(0, {\n    min: 0,\n    max: 100,\n    step: 5,\n  });\n\n  return (\n    <div className=\"flex flex-col gap-2 w-fit\">\n      <h1>\n        Counter: <span className=\"text-destructive\">{count}</span>\n      </h1>\n      <div className=\"flex gap-2.5 flex-wrap\">\n        <Button variant={'secondary'} onClick={increment}>\n          Increment +\n        </Button>\n        <Button variant={'secondary'} onClick={decrement}>\n          Decrement -\n        </Button>\n        <Button variant={'secondary'} onClick={reset}>\n          Reset\n        </Button>\n      </div>\n    </div>\n  );\n};\n\nexport default CounterComponent;\n"
        }
      }
    },
    "category": "state",
    "type": "react-hooks"
  },
  "useDebounceCallback": {
    "name": "useDebounceCallback",
    "code": {
      "ts": "import debounce from '@/registry/functions/functional/debounce';\nimport { useCallback } from 'react';\n\nfunction useDebounceCallback<A extends unknown[]>(\n  fn: (...args: A) => void,\n  delay: number = 300,\n) {\n  const debouncedFn = useCallback(debounce(fn, delay), []);\n  return debouncedFn;\n}\n\nexport default useDebounceCallback;\n",
      "js": "import debounce from '@/registry/functions/functional/debounce';\nimport { useCallback } from 'react';\nfunction useDebounceCallback(fn, delay = 300) {\n  const debouncedFn = useCallback(debounce(fn, delay), []);\n  return debouncedFn;\n}\nexport default useDebounceCallback;\n"
    },
    "examples": {
      "debounce": {
        "component": lazy(() => import("@/registry/react-hooks/functional/useDebounceCallback/debounce.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React, { useState } from 'react';\nimport useDebounce from '.';\n\nconst DebounceExample = () => {\n  const [inputValue, setInputValue] = useState<string>('');\n  const [originalChanges, setOriginalChanges] = useState<number>(0);\n  const [debouncedChanges, setDebouncedChanges] = useState<number>(0);\n\n  // Using the custom debounce hook\n  const debouncedUpdate = useDebounce((value: string) => {\n    setDebouncedValue(value);\n    setDebouncedChanges((prev) => prev + 1);\n  }, 500);\n\n  const [debouncedValue, setDebouncedValue] = useState<string>('');\n\n  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const newValue = e.target.value;\n    setInputValue(newValue);\n    setOriginalChanges((prev) => prev + 1);\n    debouncedUpdate(newValue); // Debounce the value\n  };\n\n  return (\n    <div className=\"w-full max-w-md m-auto my-6\">\n      <h2 className=\"text-xl font-bold text-foreground mb-4\">\n        Debounce Example\n      </h2>\n\n      <div className=\"mb-4\">\n        <label htmlFor=\"input\" className=\"block text-foreground mb-2\">\n          Type something:\n        </label>\n        <input\n          type=\"text\"\n          id=\"input\"\n          value={inputValue}\n          onChange={handleInputChange}\n          className=\"w-full p-2 border border-muted-foreground rounded-md\"\n        />\n      </div>\n\n      <div className=\"space-y-4\">\n        <div>\n          <p className=\"text-foreground\">\n            <strong>Original Value:</strong> {inputValue}\n          </p>\n          <p className=\"text-muted-foreground\">\n            Changes: {originalChanges} times\n          </p>\n        </div>\n\n        <div>\n          <p className=\"text-foreground\">\n            <strong>Debounced Value:</strong> {debouncedValue}\n          </p>\n          <p className=\"text-muted-foreground\">\n            Changes: {debouncedChanges} times\n          </p>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default DebounceExample;\n"
        }
      }
    },
    "category": "functional",
    "type": "react-hooks"
  },
  "useDebounceValue": {
    "name": "useDebounceValue",
    "code": {
      "ts": "import { useState, useEffect } from 'react';\n\n/**\n * Custom hook that returns a debounced value after a specified delay.\n */\nfunction useDebouncedValue<T>(value: T, delay: number = 300): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(timer);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\nexport default useDebouncedValue;\n",
      "js": "import { useState, useEffect } from 'react';\n/**\n * Custom hook that returns a debounced value after a specified delay.\n */\nfunction useDebouncedValue(value, delay = 300) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n    return () => {\n      clearTimeout(timer);\n    };\n  }, [value, delay]);\n  return debouncedValue;\n}\nexport default useDebouncedValue;\n"
    },
    "examples": {
      "debounce": {
        "component": lazy(() => import("@/registry/react-hooks/functional/useDebounceValue/debounce.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React, { useState } from 'react';\nimport useDebouncedValue from '.';\n\nconst DebounceExample = () => {\n  const [inputValue, setInputValue] = useState<string>('');\n\n  // Using the custom debounce hook\n  const debouncedValue = useDebouncedValue(inputValue, 500);\n\n  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const newValue = e.target.value;\n    setInputValue(newValue);\n  };\n\n  return (\n    <div className=\"w-full max-w-md m-auto my-6\">\n      <h2 className=\"text-xl font-bold text-foreground mb-4\">\n        Debounce Value Example\n      </h2>\n\n      <div className=\"mb-4\">\n        <label htmlFor=\"input\" className=\"block text-foreground mb-2\">\n          Type something:\n        </label>\n        <input\n          type=\"text\"\n          id=\"input\"\n          value={inputValue}\n          onChange={handleInputChange}\n          className=\"w-full p-2 border border-muted-foreground rounded-md\"\n        />\n      </div>\n\n      <div className=\"space-y-4\">\n        <div>\n          <p className=\"text-foreground\">\n            <strong>Original Value:</strong> {inputValue}\n          </p>\n        </div>\n\n        <div>\n          <p className=\"text-foreground\">\n            <strong>Debounced Value:</strong> {debouncedValue}\n          </p>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default DebounceExample;\n"
        }
      }
    },
    "category": "functional",
    "type": "react-hooks"
  },
  "useInnerSize": {
    "name": "useInnerSize",
    "code": {
      "ts": "import React, { useState, useEffect } from 'react';\n\ninterface UseInnerSizeReturn {\n  width: number;\n  height: number;\n}\n\n/**\n * tracks the size of a referenced element or the window and returns its width and height, updating on window resize.\n */\nconst useInnerSize = (\n  ref?: React.RefObject<HTMLElement>,\n): UseInnerSizeReturn => {\n  const [size, setSize] = useState<{ width: number; height: number }>({\n    width: 0,\n    height: 0,\n  });\n\n  useEffect(() => {\n    const updateSize = () => {\n      if (ref && ref.current) {\n        // Track the element's size if ref is provided\n        setSize({\n          width: ref.current.offsetWidth,\n          height: ref.current.offsetHeight,\n        });\n      } else {\n        // Track the window size if ref is not provided\n        setSize({\n          width: window.innerWidth,\n          height: window.innerHeight,\n        });\n      }\n    };\n\n    // Initial size update\n    updateSize();\n\n    // Listen for window resize events\n    const handleResize = () => {\n      updateSize();\n    };\n\n    window.addEventListener('resize', handleResize);\n\n    // Cleanup the event listener on component unmount\n    return () => {\n      window.removeEventListener('resize', handleResize);\n    };\n  }, [ref]); // Re-run effect if ref changes\n\n  return size;\n};\n\nexport default useInnerSize;\n",
      "js": "import { useState, useEffect } from 'react';\n/**\n * tracks the size of a referenced element or the window and returns its width and height, updating on window resize.\n */\nconst useInnerSize = (ref) => {\n  const [size, setSize] = useState({\n    width: 0,\n    height: 0,\n  });\n  useEffect(() => {\n    const updateSize = () => {\n      if (ref && ref.current) {\n        // Track the element's size if ref is provided\n        setSize({\n          width: ref.current.offsetWidth,\n          height: ref.current.offsetHeight,\n        });\n      } else {\n        // Track the window size if ref is not provided\n        setSize({\n          width: window.innerWidth,\n          height: window.innerHeight,\n        });\n      }\n    };\n    // Initial size update\n    updateSize();\n    // Listen for window resize events\n    const handleResize = () => {\n      updateSize();\n    };\n    window.addEventListener('resize', handleResize);\n    // Cleanup the event listener on component unmount\n    return () => {\n      window.removeEventListener('resize', handleResize);\n    };\n  }, [ref]); // Re-run effect if ref changes\n  return size;\n};\nexport default useInnerSize;\n"
    },
    "examples": {
      "inner-size": {
        "component": lazy(() => import("@/registry/react-hooks/web-api/useInnerSize/inner-size.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\n\nimport { useRef } from 'react';\nimport useInnerSize from '.';\n\nconst InnerSizeExample = () => {\n  const windowSize = useInnerSize();\n  const boxRef = useRef(null);\n  const boxSize = useInnerSize(boxRef);\n  return (\n    <div className=\"w-full h-full flex items-center justify-center gap-4 text-center p-6\">\n      <span>Try Resizing the window!</span>\n      <div className=\"flex flex-col\">\n        <span>Window Size</span>\n        <span>\n          Height - {windowSize.height}, Width - {windowSize.width}\n        </span>\n      </div>\n      <div\n        ref={boxRef}\n        className=\"w-1/2 border-muted-foreground h-16 flex items-center justify-center\"\n      >\n        <span>Bix Size</span>\n        <span>\n          Height - {boxSize.height}, Width - {boxSize.width}\n        </span>\n      </div>\n    </div>\n  );\n};\nexport default InnerSizeExample;\n"
        }
      }
    },
    "category": "web-api",
    "type": "react-hooks"
  },
  "useMockLoading": {
    "name": "useMockLoading",
    "code": {
      "ts": "import { useCallback, useEffect, useState } from 'react';\n\n/**\n * custom hook that simulates a loading state with optional auto-start and manual start/stop controls.\n */\nconst useMockLoading = ({\n  defaultValue = true,\n  loadingTime = 3000,\n  autoStart = true,\n}) => {\n  const [loading, setLoading] = useState(defaultValue);\n  const [isAutoStart, setIsAutoStart] = useState(autoStart);\n\n  const startLoading = useCallback(() => {\n    setIsAutoStart(true);\n  }, []);\n\n  const stopLoading = useCallback(() => {\n    setIsAutoStart(false);\n  }, []);\n\n  useEffect(() => {\n    let timeout: any;\n\n    if (isAutoStart) {\n      setLoading(true);\n      timeout = setTimeout(() => {\n        setLoading(false);\n      }, loadingTime);\n    } else {\n      setLoading(false);\n    }\n\n    return () => {\n      clearTimeout(timeout);\n    };\n  }, [isAutoStart, loadingTime]);\n\n  return {\n    loading,\n    startLoading,\n    stopLoading,\n  };\n};\n\nexport default useMockLoading;\n",
      "js": "import { useCallback, useEffect, useState } from 'react';\n/**\n * custom hook that simulates a loading state with optional auto-start and manual start/stop controls.\n */\nconst useMockLoading = ({\n  defaultValue = true,\n  loadingTime = 3000,\n  autoStart = true,\n}) => {\n  const [loading, setLoading] = useState(defaultValue);\n  const [isAutoStart, setIsAutoStart] = useState(autoStart);\n  const startLoading = useCallback(() => {\n    setIsAutoStart(true);\n  }, []);\n  const stopLoading = useCallback(() => {\n    setIsAutoStart(false);\n  }, []);\n  useEffect(() => {\n    let timeout;\n    if (isAutoStart) {\n      setLoading(true);\n      timeout = setTimeout(() => {\n        setLoading(false);\n      }, loadingTime);\n    } else {\n      setLoading(false);\n    }\n    return () => {\n      clearTimeout(timeout);\n    };\n  }, [isAutoStart, loadingTime]);\n  return {\n    loading,\n    startLoading,\n    stopLoading,\n  };\n};\nexport default useMockLoading;\n"
    },
    "examples": {
      "mock-loading": {
        "component": lazy(() => import("@/registry/react-hooks/state/useMockLoading/mock-loading.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport { Button } from '@/components/ui/button';\nimport useMockLoading from '@/registry/react-hooks/state/useMockLoading';\n\nconst MockLoading = () => {\n  const { loading, startLoading, stopLoading } = useMockLoading({\n    defaultValue: true,\n    loadingTime: 5000,\n    autoStart: false,\n  });\n\n  return (\n    <div className=\"space-y-4\">\n      {loading ? <p>Loading for 5000ms...</p> : <p>Content Loaded</p>}\n      <Button variant={'secondary'} size={'sm'} onClick={startLoading}>\n        Start Loading\n      </Button>\n      <Button\n        variant={'secondary'}\n        size={'sm'}\n        onClick={stopLoading}\n        className=\"ml-4\"\n      >\n        Stop Loading\n      </Button>\n    </div>\n  );\n};\n\nexport default MockLoading;\n"
        }
      }
    },
    "category": "state",
    "type": "react-hooks"
  },
  "useObserve": {
    "name": "useObserve",
    "code": {
      "ts": "import React, { useEffect, useState, useRef } from 'react';\n\nexport interface UseObserveConfig {\n  once?: boolean; // Trigger callback only once\n  autoEnable?: boolean; // Whether to enable the observer immediately (default: true)\n  threshold?: number | number[]; // Intersection threshold(s)\n  root?: HTMLElement | null; // The root element for the intersection observer\n  rootMargin?: string; // Margin around the root\n  onIntersect?: () => void; // Callback when the element intersects\n  onLeave?: () => void; // Callback when the element leaves the viewport\n}\n\nexport interface UseObserveReturn {\n  position: DOMRect | null; // The position of the element\n  isIntersecting: boolean; // Whether the element is currently intersecting the viewport\n  enable: () => void; // Enable the observer\n  disable: () => void; // Disable the observer\n  isEnabled: boolean;\n}\n\nconst useObserve = (\n  ref: React.RefObject<HTMLElement>,\n  config: UseObserveConfig = {},\n): UseObserveReturn => {\n  const {\n    once = false,\n    autoEnable = true,\n    threshold = 0,\n    root = null,\n    rootMargin = '0px',\n    onIntersect = () => {},\n    onLeave = () => {},\n  } = config;\n\n  const [isIntersecting, setIsIntersecting] = useState(false);\n  const [position, setPosition] = useState<DOMRect | null>(null);\n  const [enabled, setEnabled] = useState(autoEnable);\n\n  const observerRef = useRef<IntersectionObserver | null>(null);\n  const previousIsIntersectingRef = useRef<boolean>(false); // Track previous intersection state\n\n  const enable = () => setEnabled(true);\n  const disable = () => setEnabled(false);\n\n  useEffect(() => {\n    if (!enabled || !ref.current) return;\n\n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          setPosition(entry.boundingClientRect);\n\n          const currentIsIntersecting = entry.isIntersecting;\n\n          if (currentIsIntersecting !== previousIsIntersectingRef.current) {\n            setIsIntersecting(currentIsIntersecting);\n\n            if (currentIsIntersecting) {\n              onIntersect();\n              if (once) observer.disconnect();\n            } else {\n              onLeave();\n            }\n\n            previousIsIntersectingRef.current = currentIsIntersecting; // Update the previous state\n          }\n        });\n      },\n      {\n        root,\n        rootMargin,\n        threshold,\n      },\n    );\n\n    observer.observe(ref.current);\n    observerRef.current = observer;\n\n    return () => {\n      observer.disconnect();\n    };\n  }, [ref, enabled, once, root, rootMargin, threshold, onIntersect, onLeave]);\n\n  return { position, isIntersecting, enable, disable, isEnabled: enabled };\n};\n\nexport default useObserve;\n",
      "js": "import { useEffect, useState, useRef } from 'react';\nconst useObserve = (ref, config = {}) => {\n  const {\n    once = false,\n    autoEnable = true,\n    threshold = 0,\n    root = null,\n    rootMargin = '0px',\n    onIntersect = () => {},\n    onLeave = () => {},\n  } = config;\n  const [isIntersecting, setIsIntersecting] = useState(false);\n  const [position, setPosition] = useState(null);\n  const [enabled, setEnabled] = useState(autoEnable);\n  const observerRef = useRef(null);\n  const previousIsIntersectingRef = useRef(false); // Track previous intersection state\n  const enable = () => setEnabled(true);\n  const disable = () => setEnabled(false);\n  useEffect(() => {\n    if (!enabled || !ref.current) return;\n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          setPosition(entry.boundingClientRect);\n          const currentIsIntersecting = entry.isIntersecting;\n          if (currentIsIntersecting !== previousIsIntersectingRef.current) {\n            setIsIntersecting(currentIsIntersecting);\n            if (currentIsIntersecting) {\n              onIntersect();\n              if (once) observer.disconnect();\n            } else {\n              onLeave();\n            }\n            previousIsIntersectingRef.current = currentIsIntersecting; // Update the previous state\n          }\n        });\n      },\n      {\n        root,\n        rootMargin,\n        threshold,\n      },\n    );\n    observer.observe(ref.current);\n    observerRef.current = observer;\n    return () => {\n      observer.disconnect();\n    };\n  }, [ref, enabled, once, root, rootMargin, threshold, onIntersect, onLeave]);\n  return { position, isIntersecting, enable, disable, isEnabled: enabled };\n};\nexport default useObserve;\n"
    },
    "examples": {
      "observe": {
        "component": lazy(() => import("@/registry/react-hooks/web-api/useObserve/observe.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "'use client';\nimport React, { useRef } from 'react';\nimport useObserve from '.';\nimport toast from 'react-hot-toast';\nimport { Button } from '@/components/ui/button';\n\nconst ExampleComponent = () => {\n  const ref = useRef<HTMLDivElement>(null);\n\n  const { isIntersecting, enable, disable, isEnabled } = useObserve(ref, {\n    once: true,\n    autoEnable: true,\n    threshold: 0.5, // Trigger when 50% of the element is in the viewport\n    onIntersect: () => toast.success('Element is intersecting!'),\n    onLeave: () => toast.error('Element has left the viewport!'),\n  });\n\n  return (\n    <div\n      ref={ref}\n      className=\"bg-muted flex items-center justify-center gap-2.5 h-full flex-col p-6\"\n    >\n      <span className=\"text-center text-lg\">\n        Element - {isIntersecting ? 'Visible' : 'Hidden'}\n      </span>\n      <Button onClick={enable} disabled={isEnabled}>\n        Enable Observer\n      </Button>\n      <Button onClick={disable} disabled={!isEnabled}>\n        Disable Observer\n      </Button>\n    </div>\n  );\n};\n\nexport default ExampleComponent;\n"
        }
      }
    },
    "category": "web-api",
    "type": "react-hooks"
  },
  "useShortcutKey": {
    "name": "useShortcutKey",
    "code": {
      "ts": "import React, { useState, useEffect, useCallback } from 'react';\n\nexport type ShortcutKeyCallback = (\n  ref: React.RefObject<HTMLElement>,\n  event: KeyboardEvent,\n) => void;\n\nexport interface UseShortcutKeyConfig {\n  keys: string | string[]; // Can be a single key, array of keys\n  preventDefault?: boolean; // Whether to prevent the default action for the key combination\n  callback?: ShortcutKeyCallback; // Callback triggered when the key combination is pressed\n  autoEnable?: boolean; // Whether to enable the shortcut listening by default (default: true)\n}\n\n/**\n * triggers a callback or click on specified keyboard shortcuts, with options to enable/disable and prevent default actions.\n */\nconst useShortcutKey = (\n  ref: React.RefObject<HTMLElement>,\n  config: UseShortcutKeyConfig,\n) => {\n  const { keys, preventDefault = true, callback, autoEnable = true } = config;\n\n  const [isEnabled, setIsEnabled] = useState(autoEnable); // Track whether the listener is enabled\n\n  const handleKeyDown = useCallback(\n    (event: KeyboardEvent) => {\n      if (!ref.current) return;\n\n      const keyCombinations = Array.isArray(keys) ? keys : [keys];\n\n      keyCombinations.forEach((keyCombo) => {\n        const keysArray = Array.isArray(keyCombo)\n          ? keyCombo\n          : keyCombo.split('+');\n\n        const isMatch = keysArray.every((key) => {\n          if (key === 'Control') return event.ctrlKey;\n          if (key === 'Shift') return event.shiftKey;\n          if (key === 'Alt') return event.altKey;\n          return event.key === key || event.code === key;\n        });\n\n        if (isMatch) {\n          if (preventDefault) event.preventDefault();\n          if (callback) {\n            callback(ref, event);\n          } else {\n            ref.current?.click();\n          }\n        }\n      });\n    },\n    [ref, keys, callback, preventDefault],\n  );\n\n  useEffect(() => {\n    if (!isEnabled) return;\n\n    const handler = (event: KeyboardEvent) => handleKeyDown(event);\n\n    // Add the event listener if enabled\n    window.addEventListener('keydown', handler);\n\n    // Cleanup the event listener when the component unmounts or dependencies change\n    return () => {\n      window.removeEventListener('keydown', handler);\n    };\n  }, [handleKeyDown, isEnabled]);\n\n  // Functions to enable and disable the event listener\n  const enable = () => setIsEnabled(true);\n  const disable = () => setIsEnabled(false);\n\n  return { enable, disable, isEnabled };\n};\n\nexport default useShortcutKey;\n",
      "js": "import { useState, useEffect, useCallback } from 'react';\n/**\n * triggers a callback or click on specified keyboard shortcuts, with options to enable/disable and prevent default actions.\n */\nconst useShortcutKey = (ref, config) => {\n  const { keys, preventDefault = true, callback, autoEnable = true } = config;\n  const [isEnabled, setIsEnabled] = useState(autoEnable); // Track whether the listener is enabled\n  const handleKeyDown = useCallback(\n    (event) => {\n      if (!ref.current) return;\n      const keyCombinations = Array.isArray(keys) ? keys : [keys];\n      keyCombinations.forEach((keyCombo) => {\n        const keysArray = Array.isArray(keyCombo)\n          ? keyCombo\n          : keyCombo.split('+');\n        const isMatch = keysArray.every((key) => {\n          if (key === 'Control') return event.ctrlKey;\n          if (key === 'Shift') return event.shiftKey;\n          if (key === 'Alt') return event.altKey;\n          return event.key === key || event.code === key;\n        });\n        if (isMatch) {\n          if (preventDefault) event.preventDefault();\n          if (callback) {\n            callback(ref, event);\n          } else {\n            ref.current?.click();\n          }\n        }\n      });\n    },\n    [ref, keys, callback, preventDefault],\n  );\n  useEffect(() => {\n    if (!isEnabled) return;\n    const handler = (event) => handleKeyDown(event);\n    // Add the event listener if enabled\n    window.addEventListener('keydown', handler);\n    // Cleanup the event listener when the component unmounts or dependencies change\n    return () => {\n      window.removeEventListener('keydown', handler);\n    };\n  }, [handleKeyDown, isEnabled]);\n  // Functions to enable and disable the event listener\n  const enable = () => setIsEnabled(true);\n  const disable = () => setIsEnabled(false);\n  return { enable, disable, isEnabled };\n};\nexport default useShortcutKey;\n"
    },
    "examples": {
      "shortcut-key": {
        "component": lazy(() => import("@/registry/react-hooks/web-api/useShortcutKey/shortcut-key.example").catch(err => {
        console.error('Failed to import component:', err);
        return Promise.resolve(() => <div className='my-2 text-destructive'>Error loading component</div>);
    })),
        "code": {
          "tsx": "import React, { useRef, useState } from 'react';\nimport useShortcutKey from '.';\nimport { Button } from '@/components/ui/button';\nimport toast from 'react-hot-toast';\n\nconst ShortcutExample = () => {\n  const [message, setMessage] = useState('');\n  const buttonRef = useRef<HTMLButtonElement>(null);\n\n  const { enable, disable, isEnabled } = useShortcutKey(buttonRef, {\n    keys: ['Control', 'S'],\n    preventDefault: true,\n    autoEnable: true,\n  });\n\n  return (\n    <div className=\"flex flex-col w-full h-full items-center justify-center gap-4\">\n      <Button\n        variant={'secondary'}\n        size={'sm'}\n        ref={buttonRef}\n        onClick={() => {\n          toast.success('Button is clicked');\n        }}\n      >\n        Press `Ctrl + S`\n      </Button>\n      <p>{message}</p>\n      <p>Shortcut listener is {isEnabled ? 'enabled' : 'disabled'}</p>\n      <Button variant={'outline'} size={'sm'} onClick={enable}>\n        Enable Shortcut\n      </Button>\n      <Button variant={'outline'} size={'sm'} onClick={disable}>\n        Disable Shortcut\n      </Button>\n    </div>\n  );\n};\n\nexport default ShortcutExample;\n"
        }
      }
    },
    "category": "web-api",
    "type": "react-hooks"
  },
  "zip": {
    "name": "zip",
    "code": {
      "ts": "/**\n * Zips arrays together in the form of an array of arrays.\n **/\ntype Args<T extends Array<Array<unknown>>> = {\n  arr: T;\n  strict?: boolean;\n};\n\nconst zip = <T extends Array<Array<unknown>>>({\n  arr,\n  strict = false,\n}: Args<T>): T => {\n  const maxIndex = arr.map((a) => a.length).reduce((a, b) => Math.max(a, b), 0);\n  const minIndex = arr\n    .map((a) => a.length)\n    .reduce((a, b) => Math.min(a, b), maxIndex);\n\n  let result = [] as unknown[][];\n\n  const upto = strict ? minIndex : maxIndex;\n\n  for (let i = 0; i < upto; i++) {\n    const zip = arr.map((a) => a[i]);\n    result.push(zip);\n  }\n\n  return result as T;\n};\n\nexport default zip;\n",
      "js": "const zip = ({ arr, strict = false }) => {\n  const maxIndex = arr.map((a) => a.length).reduce((a, b) => Math.max(a, b), 0);\n  const minIndex = arr\n    .map((a) => a.length)\n    .reduce((a, b) => Math.min(a, b), maxIndex);\n  let result = [];\n  const upto = strict ? minIndex : maxIndex;\n  for (let i = 0; i < upto; i++) {\n    const zip = arr.map((a) => a[i]);\n    result.push(zip);\n  }\n  return result;\n};\nexport default zip;\n"
    },
    "examples": {},
    "category": "arrays",
    "type": "functions"
  }
} as Record<string, IRegistryJSON>

export default registry;