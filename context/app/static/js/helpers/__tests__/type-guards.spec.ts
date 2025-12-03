import { isEmpty, isObject, isPrimitive, isEmptyArrayOrObject, isDeepEmpty } from '../type-guards';

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

describe('isEmptyArrayOrObject', () => {
  test('should return true for empty array', () => {
    expect(isEmptyArrayOrObject([])).toBe(true);
  });

  test('should return false for non-empty array', () => {
    expect(isEmptyArrayOrObject([1])).toBe(false);
    expect(isEmptyArrayOrObject([1, 2, 3])).toBe(false);
    expect(isEmptyArrayOrObject(['a', 'b'])).toBe(false);
    expect(isEmptyArrayOrObject([null, undefined])).toBe(false);
  });

  test('should return true for empty plain object', () => {
    expect(isEmptyArrayOrObject({})).toBe(true);
  });

  test('should return false for non-empty plain object', () => {
    expect(isEmptyArrayOrObject({ key: 'value' })).toBe(false);
    expect(isEmptyArrayOrObject({ a: 1, b: 2 })).toBe(false);
    expect(isEmptyArrayOrObject({ nested: {} })).toBe(false);
  });

  test('should return false for objects with constructor other than Object', () => {
    expect(isEmptyArrayOrObject(new Date())).toBe(false);
    expect(isEmptyArrayOrObject(new Map())).toBe(false);
    expect(isEmptyArrayOrObject(new Set())).toBe(false);
    expect(isEmptyArrayOrObject(/regex/)).toBe(false);
    expect(isEmptyArrayOrObject(new Error())).toBe(false);
  });

  test('should return false for objects created with custom constructors', () => {
    class CustomClass {}
    expect(isEmptyArrayOrObject(new CustomClass())).toBe(false);
  });

  test('should handle objects created with Object.create(null)', () => {
    const obj = Object.create(null) as Record<string, unknown>;

    // Now correctly handles Object.create(null) - should return true for empty object
    expect(isEmptyArrayOrObject(obj)).toBe(true);
  });

  test('should handle objects created with Object.create(null) with properties', () => {
    const obj = Object.create(null) as Record<string, unknown>;
    obj.prop = 'value';

    // Now correctly handles Object.create(null) - should return false for non-empty object
    expect(isEmptyArrayOrObject(obj)).toBe(false);
  });

  test('should handle edge cases with array-like objects', () => {
    const arrayLikeEmpty = { length: 0 };
    const arrayLikeWithItems = { 0: 'a', 1: 'b', length: 2 };

    expect(isEmptyArrayOrObject(arrayLikeEmpty)).toBe(false); // Has length property
    expect(isEmptyArrayOrObject(arrayLikeWithItems)).toBe(false); // Has properties
  });
});

describe('isDeepEmpty', () => {
  test('should return true for null and undefined', () => {
    expect(isDeepEmpty(null)).toBe(true);
    expect(isDeepEmpty(undefined)).toBe(true);
  });

  test('should return true for falsy primitive values', () => {
    expect(isDeepEmpty(false)).toBe(true);
    expect(isDeepEmpty(0)).toBe(true);
    expect(isDeepEmpty('')).toBe(true);
    expect(isDeepEmpty(NaN)).toBe(true);
  });

  test('should return false for truthy primitive values', () => {
    expect(isDeepEmpty(true)).toBe(false);
    expect(isDeepEmpty(1)).toBe(false);
    expect(isDeepEmpty('hello')).toBe(false);
    expect(isDeepEmpty(' ')).toBe(false); // whitespace is truthy
  });

  test('should return true for empty arrays', () => {
    expect(isDeepEmpty([])).toBe(true);
  });

  test('should return false for arrays with non-empty values', () => {
    expect(isDeepEmpty([1])).toBe(false);
    expect(isDeepEmpty(['hello'])).toBe(false);
    expect(isDeepEmpty([true])).toBe(false);
    expect(isDeepEmpty([{ key: 'value' }])).toBe(false);
  });

  test('should return true for arrays with only empty values', () => {
    expect(isDeepEmpty([null])).toBe(true);
    expect(isDeepEmpty([undefined])).toBe(true);
    expect(isDeepEmpty([null, undefined])).toBe(true);
    expect(isDeepEmpty([[], {}])).toBe(true);
    expect(isDeepEmpty([0, false, ''])).toBe(true);
  });

  test('should return true for arrays with nested empty structures', () => {
    expect(isDeepEmpty([[], []])).toBe(true);
    expect(isDeepEmpty([{}, {}])).toBe(true);
    expect(isDeepEmpty([[], {}, null, undefined])).toBe(true);
    expect(isDeepEmpty([[{}], [[]]])).toBe(true);
  });

  test('should return false for arrays with mixed empty and non-empty values', () => {
    expect(isDeepEmpty([null, 'hello'])).toBe(false);
    expect(isDeepEmpty([[], [1]])).toBe(false);
    expect(isDeepEmpty([{}, { key: 'value' }])).toBe(false);
  });

  test('should return true for empty plain objects', () => {
    expect(isDeepEmpty({})).toBe(true);
  });

  test('should return false for objects with non-empty values', () => {
    expect(isDeepEmpty({ key: 'value' })).toBe(false);
    expect(isDeepEmpty({ num: 1 })).toBe(false);
    expect(isDeepEmpty({ bool: true })).toBe(false);
    expect(isDeepEmpty({ nested: { key: 'value' } })).toBe(false);
  });

  test('should return true for objects with only empty values', () => {
    expect(isDeepEmpty({ a: null })).toBe(true);
    expect(isDeepEmpty({ a: undefined })).toBe(true);
    expect(isDeepEmpty({ a: null, b: undefined })).toBe(true);
    expect(isDeepEmpty({ a: [], b: {} })).toBe(true);
    expect(isDeepEmpty({ a: 0, b: false, c: '' })).toBe(true);
  });

  test('should return true for objects with nested empty structures', () => {
    expect(isDeepEmpty({ a: {}, b: {} })).toBe(true);
    expect(isDeepEmpty({ a: [], b: [] })).toBe(true);
    expect(isDeepEmpty({ a: { nested: {} } })).toBe(true);
    expect(isDeepEmpty({ a: { nested: [] } })).toBe(true);
    expect(isDeepEmpty({ a: [{}], b: [[]] })).toBe(true);
  });

  test('should return false for objects with mixed empty and non-empty values', () => {
    expect(isDeepEmpty({ a: null, b: 'value' })).toBe(false);
    expect(isDeepEmpty({ a: {}, b: { key: 'value' } })).toBe(false);
    expect(isDeepEmpty({ a: [], b: [1] })).toBe(false);
  });

  test('should handle deeply nested structures', () => {
    expect(isDeepEmpty({ a: { b: { c: {} } } })).toBe(true);
    expect(isDeepEmpty({ a: { b: { c: [] } } })).toBe(true);
    expect(isDeepEmpty({ a: { b: { c: null } } })).toBe(true);
    expect(isDeepEmpty({ a: { b: { c: 'value' } } })).toBe(false);

    expect(isDeepEmpty([[[[]]]])).toBe(true);
    expect(isDeepEmpty([[[['value']]]])).toBe(false);
  });

  test('should return false for non-plain objects', () => {
    expect(isDeepEmpty(new Date())).toBe(false);
    expect(isDeepEmpty(new Map())).toBe(false);
    expect(isDeepEmpty(new Set())).toBe(false);
    expect(isDeepEmpty(/regex/)).toBe(false);
    expect(isDeepEmpty(new Error())).toBe(false);
  });

  test('should handle objects created with Object.create(null)', () => {
    const emptyObj = Object.create(null) as Record<string, unknown>;
    // Now correctly handles Object.create(null) - should return true for empty object
    expect(isDeepEmpty(emptyObj)).toBe(true);

    const nonEmptyObj = Object.create(null) as Record<string, unknown>;
    nonEmptyObj.prop = 'value';
    expect(isDeepEmpty(nonEmptyObj)).toBe(false);
  });

  test('should handle complex mixed scenarios', () => {
    expect(
      isDeepEmpty({
        a: [],
        b: {},
        c: null,
        d: undefined,
        e: 0,
        f: false,
        g: '',
        h: { nested: [] },
        i: [{}],
      }),
    ).toBe(true);

    expect(
      isDeepEmpty({
        a: [],
        b: {},
        c: null,
        d: undefined,
        e: 'not empty', // This makes the whole structure non-empty
      }),
    ).toBe(false);
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
