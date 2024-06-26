import { makeGridTemplateColumns } from './utils';

const testCards = [1, 2, 3];

const unexpandedResult = '1fr 1fr 1fr';
const firstExpandedResult = '3fr 1fr 1fr';
const secondExpandedResult = '1fr 3fr 1fr';
const thirdExpandedResult = '1fr 1fr 3fr';

describe('makeGridTemplateColumns', () => {
  it('should return 1fr 1fr 1fr when expandedCardIndex is null', () => {
    expect(makeGridTemplateColumns(testCards, null)).toEqual(unexpandedResult);
  });
  it.each([
    [0, firstExpandedResult],
    [1, secondExpandedResult],
    [2, thirdExpandedResult],
  ])('should return %s when expandedCardIndex is %s', (index, result) => {
    expect(makeGridTemplateColumns(testCards, index)).toEqual(result);
  });
});
