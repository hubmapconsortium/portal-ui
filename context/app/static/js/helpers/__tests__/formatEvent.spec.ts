import { formatEvent } from '../trackers';

test('should return ID as label if label undefined.', () => {
  expect(formatEvent({}, 'HBM.123.456')).toEqual({ label: '<HBM.123.456>', name: '<HBM.123.456>' });
});

test('should return label unmodified if ID undefined.', () => {
  expect(formatEvent({ label: 'abc' })).toEqual({ label: 'abc', name: 'abc' });
});

test('should return ID prepended to label if both defined.', () => {
  expect(formatEvent({ label: 'abc' }, 'HBM.123.456')).toEqual({
    label: '<HBM.123.456> abc',
    name: '<HBM.123.456> abc',
  });
});

test('should stringify label objects.', () => {
  expect(formatEvent({ label: { animal: 'dog', age: 3 } })).toEqual({
    label: '{"animal":"dog","age":3}',
    name: '{"animal":"dog","age":3}',
  });
});

test('should prepend ID before stringified label objects.', () => {
  expect(formatEvent({ label: { animal: 'dog', age: 3 } }, 'HBM.123.456')).toEqual({
    label: '<HBM.123.456> {"animal":"dog","age":3}',
    name: '<HBM.123.456> {"animal":"dog","age":3}',
  });
});

test('should preserve number values.', () => {
  expect(formatEvent({ category: 'test', value: 42 })).toEqual(
    expect.objectContaining({ category: 'test', value: 42 }),
  );
});

test('should preserve zero as a number.', () => {
  expect(formatEvent({ category: 'test', value: 0 })).toEqual(expect.objectContaining({ category: 'test', value: 0 }));
});

test('should keep string values as strings.', () => {
  expect(formatEvent({ category: 'test', action: 'click' })).toEqual(
    expect.objectContaining({ category: 'test', action: 'click' }),
  );
});

test('should JSON-stringify boolean values.', () => {
  expect(formatEvent({ category: 'test', flag: true })).toEqual(
    expect.objectContaining({ category: 'test', flag: 'true' }),
  );
});

test('should JSON-stringify object values.', () => {
  expect(formatEvent({ category: 'test', data: { key: 'val' } })).toEqual(
    expect.objectContaining({ category: 'test', data: '{"key":"val"}' }),
  );
});

test('should handle mixed value types with ID.', () => {
  expect(formatEvent({ category: 'test', value: 5, action: 'click', flag: false }, 'HBM.1')).toEqual(
    expect.objectContaining({
      category: 'test',
      value: 5,
      action: 'click',
      flag: 'false',
      label: '<HBM.1>',
      name: '<HBM.1>',
    }),
  );
});
