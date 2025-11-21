// import { render, screen } from 'test-utils/functions';
import { getUniqueNewNodes } from './ShowDerivedEntitiesButton';
import { Node } from '@xyflow/react';
test('should return only unique new steps', () => {
  const existingSteps = [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as Node[];
  const newSteps = [{ id: 'a' }, { id: 'c' }, { id: 'd' }] as Node[];
  expect(getUniqueNewNodes(existingSteps, newSteps)).toEqual([{ id: 'd' }]);
});
