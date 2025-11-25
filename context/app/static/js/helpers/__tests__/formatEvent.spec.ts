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
