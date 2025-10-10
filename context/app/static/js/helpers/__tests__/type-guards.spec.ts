import { isEmpty, isObject, isPrimitive } from '../type-guards';

describe('isEmpty', () => {
  test('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  test('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  test('should return false for whitespace string', () => {
    expect(isEmpty(' ')).toBe(false);
    expect(isEmpty('\n')).toBe(false);
    expect(isEmpty('\t')).toBe(false);
  });

  test('should return false for number 0', () => {
    expect(isEmpty(0)).toBe(false);
  });

  test('should return false for boolean false', () => {
    expect(isEmpty(false)).toBe(false);
  });

  test('should return false for empty array', () => {
    expect(isEmpty([])).toBe(false);
  });

  test('should return false for empty object', () => {
    expect(isEmpty({})).toBe(false);
  });

  test('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  test('should return false for non-empty object', () => {
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  test('should return false for function', () => {
    expect(isEmpty(() => {})).toBe(false);
  });

  test('should return false for Date object', () => {
    expect(isEmpty(new Date())).toBe(false);
  });

  test('should return false for NaN', () => {
    expect(isEmpty(NaN)).toBe(false);
  });
});

describe('isObject', () => {
  test('should return true for plain object', () => {
    expect(isObject({})).toBe(true);
  });

  test('should return true for object with properties', () => {
    expect(isObject({ key: 'value' })).toBe(true);
  });

  test('should return true for object created with Object.create', () => {
    expect(isObject(Object.create(null))).toBe(true);
  });

  test('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isObject(undefined)).toBe(false);
  });

  test('should return false for array', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  test('should return false for string', () => {
    expect(isObject('hello')).toBe(false);
    expect(isObject('')).toBe(false);
  });

  test('should return false for number', () => {
    expect(isObject(42)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(NaN)).toBe(false);
  });

  test('should return false for boolean', () => {
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
  });

  test('should return false for function', () => {
    expect(isObject(() => {})).toBe(false);
    expect(isObject(function () {})).toBe(false);
  });

  test('should return false for symbol', () => {
    expect(isObject(Symbol('test'))).toBe(false);
  });

  test('should return false for bigint', () => {
    expect(isObject(BigInt(123))).toBe(false);
  });

  test('should return true for Date object', () => {
    expect(isObject(new Date())).toBe(true);
  });

  test('should return true for RegExp object', () => {
    expect(isObject(/test/)).toBe(true);
  });

  test('should return true for Error object', () => {
    expect(isObject(new Error('test'))).toBe(true);
  });

  test('should return true for Map object', () => {
    expect(isObject(new Map())).toBe(true);
  });

  test('should return true for Set object', () => {
    expect(isObject(new Set())).toBe(true);
  });
});

describe('isPrimitive', () => {
  test('should return true for string', () => {
    expect(isPrimitive('hello')).toBe(true);
    expect(isPrimitive('')).toBe(true);
    expect(isPrimitive('123')).toBe(true);
  });

  test('should return true for number', () => {
    expect(isPrimitive(42)).toBe(true);
    expect(isPrimitive(0)).toBe(true);
    expect(isPrimitive(-1)).toBe(true);
    expect(isPrimitive(3.14)).toBe(true);
    expect(isPrimitive(Infinity)).toBe(true);
    expect(isPrimitive(-Infinity)).toBe(true);
    expect(isPrimitive(NaN)).toBe(true);
  });

  test('should return true for boolean', () => {
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
  });

  test('should return false for null', () => {
    expect(isPrimitive(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isPrimitive(undefined)).toBe(false);
  });

  test('should return false for object', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive({ key: 'value' })).toBe(false);
  });

  test('should return false for array', () => {
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive([1, 2, 3])).toBe(false);
  });

  test('should return false for function', () => {
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive(function () {})).toBe(false);
  });

  test('should return false for Date object', () => {
    expect(isPrimitive(new Date())).toBe(false);
  });

  test('should return false for RegExp object', () => {
    expect(isPrimitive(/test/)).toBe(false);
  });

  test('should return false for symbol', () => {
    expect(isPrimitive(Symbol('test'))).toBe(false);
  });

  test('should return false for bigint', () => {
    expect(isPrimitive(BigInt(123))).toBe(false);
  });

  test('should return false for Error object', () => {
    expect(isPrimitive(new Error('test'))).toBe(false);
  });

  test('should return false for Map object', () => {
    expect(isPrimitive(new Map())).toBe(false);
  });

  test('should return false for Set object', () => {
    expect(isPrimitive(new Set())).toBe(false);
  });
});

describe('type guards integration', () => {
  test('should work together for comprehensive type checking', () => {
    const testValues = [
      { value: null, isEmpty: true, isObject: false, isPrimitive: false },
      { value: undefined, isEmpty: true, isObject: false, isPrimitive: false },
      { value: '', isEmpty: true, isObject: false, isPrimitive: true },
      { value: 'hello', isEmpty: false, isObject: false, isPrimitive: true },
      { value: 0, isEmpty: false, isObject: false, isPrimitive: true },
      { value: 42, isEmpty: false, isObject: false, isPrimitive: true },
      { value: true, isEmpty: false, isObject: false, isPrimitive: true },
      { value: false, isEmpty: false, isObject: false, isPrimitive: true },
      { value: [], isEmpty: false, isObject: false, isPrimitive: false },
      { value: [1, 2, 3], isEmpty: false, isObject: false, isPrimitive: false },
      { value: {}, isEmpty: false, isObject: true, isPrimitive: false },
      { value: { key: 'value' }, isEmpty: false, isObject: true, isPrimitive: false },
    ];

    testValues.forEach(
      ({ value, isEmpty: expectedEmpty, isObject: expectedObject, isPrimitive: expectedPrimitive }) => {
        expect(isEmpty(value)).toBe(expectedEmpty);
        expect(isObject(value)).toBe(expectedObject);
        expect(isPrimitive(value)).toBe(expectedPrimitive);
      },
    );
  });

  test('should handle edge cases correctly', () => {
    // Test that boxed primitives are treated as objects, not primitives
    expect(isObject(new String('hello'))).toBe(true);
    expect(isPrimitive(new String('hello'))).toBe(false);

    expect(isObject(new Number(42))).toBe(true);
    expect(isPrimitive(new Number(42))).toBe(false);

    expect(isObject(new Boolean(true))).toBe(true);
    expect(isPrimitive(new Boolean(true))).toBe(false);
  });

  test('should work with type checking patterns', () => {
    const stringValue = 'test string';
    expect(isPrimitive(stringValue)).toBe(true);
    expect(typeof stringValue).toBe('string');

    const objectValue = { test: 'value' };
    expect(isObject(objectValue)).toBe(true);
    expect(objectValue.test).toBe('value');

    const emptyValue = null;
    expect(isEmpty(emptyValue)).toBe(true);
    expect(emptyValue).toBeNull();
  });
});
