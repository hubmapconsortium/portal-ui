import { UnprocessedFile } from '../types';
import { relativeFilePathsToTree } from './utils';

test('returns object with required keys', () => {
  const testFiles = [
    {
      rel_path: 'path1/path2/fake1.txt',
    },
    {
      rel_path: 'path1/path2/fake2.txt',
    },
    {
      rel_path: 'path1/fake3.txt',
    },
    {
      rel_path: 'path3/fake4.txt',
    },
    {
      rel_path: 'fake5.txt',
    },
  ];

  const expectedTree = {
    'path1/': {
      files: [{ file: 'fake3.txt', rel_path: 'path1/fake3.txt' }],
      'path2/': {
        files: [
          { file: 'fake1.txt', rel_path: 'path1/path2/fake1.txt' },
          { file: 'fake2.txt', rel_path: 'path1/path2/fake2.txt' },
        ],
      },
    },
    'path3/': { files: [{ file: 'fake4.txt', rel_path: 'path3/fake4.txt' }] },
    files: [{ file: 'fake5.txt', rel_path: 'fake5.txt' }],
  };
  expect(relativeFilePathsToTree(testFiles as UnprocessedFile[])).toStrictEqual(expectedTree);
});

test('retains extra entries for each file object', () => {
  const testFiles = [
    {
      rel_path: 'path1/path2/fake1.txt',
      a: 1,
    },
    {
      rel_path: 'path1/path2/fake2.txt',
    },
    {
      rel_path: 'path1/fake3.txt',
    },
    {
      rel_path: 'path3/fake4.txt',
      b: { c: 2 },
    },
    {
      rel_path: 'fake5.txt',
      d: [4, 5, 6],
    },
  ];

  const expectedTree = {
    'path1/': {
      files: [{ file: 'fake3.txt', rel_path: 'path1/fake3.txt' }],
      'path2/': {
        files: [
          { file: 'fake1.txt', rel_path: 'path1/path2/fake1.txt', a: 1 },
          { file: 'fake2.txt', rel_path: 'path1/path2/fake2.txt' },
        ],
      },
    },
    'path3/': { files: [{ file: 'fake4.txt', rel_path: 'path3/fake4.txt', b: { c: 2 } }] },
    files: [{ file: 'fake5.txt', rel_path: 'fake5.txt', d: [4, 5, 6] }],
  };
  expect(relativeFilePathsToTree(testFiles as UnprocessedFile[])).toStrictEqual(expectedTree);
});
