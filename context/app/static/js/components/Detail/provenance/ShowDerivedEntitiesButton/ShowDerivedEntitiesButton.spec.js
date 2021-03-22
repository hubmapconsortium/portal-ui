// import { render, screen } from 'test-utils/functions';
import { getUniqueNewSteps } from './ShowDerivedEntitiesButton';

test('should return only unique new steps', () => {
  const existingSteps = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
  const newSteps = [{ name: 'a' }, { name: 'c' }, { name: 'd' }];
  expect(getUniqueNewSteps(existingSteps, newSteps)).toEqual([{ name: 'd' }]);
});
