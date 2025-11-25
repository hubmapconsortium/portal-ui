import { getUniques } from './ShowDerivedEntitiesButton';
test('should return only unique new steps', () => {
  const existingSteps = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const newSteps = [{ id: 'a' }, { id: 'c' }, { id: 'd' }];
  expect(getUniques(existingSteps, newSteps)).toEqual([{ id: 'd' }]);
});
