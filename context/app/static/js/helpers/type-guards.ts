export function isEmpty(obj: unknown): obj is null | undefined {
  return obj === null || obj === undefined || obj === '';
}

export function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function isPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}
