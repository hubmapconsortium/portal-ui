import { tableToDelimitedString } from '../functions';

describe('Table to String', () => {
  const rowsInput = [
    { a: 1, b: 'test' },
    { a: 2, b: 'test2' },
    { a: 3, b: 'test3' },
  ];

  const colNamesInput = ['a', 'b'];

  test('it should return a string delimited by a tab', () => {
    const delimiterInput = '\t';

    const output = 'a\tb\n1\ttest\n2\ttest2\n3\ttest3';

    expect(tableToDelimitedString(rowsInput, colNamesInput, delimiterInput)).toEqual(output);
  });

  test('it should return a string delimited by a comma', () => {
    const delimiterInput = ',';

    const output = 'a,b\n1,test\n2,test2\n3,test3';

    expect(tableToDelimitedString(rowsInput, colNamesInput, delimiterInput)).toEqual(output);
  });
});
