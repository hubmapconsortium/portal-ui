export function isEmpty(obj: unknown): obj is null | undefined {
  return obj === null || obj === undefined || obj === '';
}

export function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function isPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}
export function isEmptyArrayOrObject(val: object | unknown[]): val is [] | Record<string, never> {
  if (Array.isArray(val)) {
    return val.length === 0;
  }

  // Handle plain objects, including those created with Object.create(null)
  if (val && typeof val === 'object') {
    // Check if it's a plain object (either has Object constructor or no constructor like Object.create(null))
    const isPlainObject = val.constructor === Object || val.constructor === undefined;
    if (isPlainObject) {
      return Object.keys(val).length === 0;
    }
  }

  return false;
}

export function isDeepEmpty(val: unknown): val is null | undefined | [] | Record<string, never> {
  if (!val || typeof val !== 'object') {
    return !val;
  }

  if (Array.isArray(val)) {
    return val.length === 0 || val.every(isDeepEmpty);
  }

  // Handle plain objects, including those created with Object.create(null)
  const isPlainObject = val.constructor === Object || val.constructor === undefined;
  if (isPlainObject) {
    const keys = Object.keys(val);
    return keys.length === 0 || keys.every((key) => isDeepEmpty((val as Record<string, unknown>)[key]));
  }

  return false;
}
