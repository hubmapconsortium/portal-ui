/* eslint-disable jest/no-export */
import { FlaskDataContextType } from 'js/components/Contexts';
import { UnprocessedFile } from './types';

export const fakeOpenDUA = jest.fn();

export const uuid = 'fakeuuid';

export const detailContext = { uuid, hubmap_id: 'f4ke.hmp.1234', mapped_data_access_level: 'Public' };
export const filesContext = { openDUA: fakeOpenDUA, hasAgreedToDUA: true };
export const flaskDataContext = { entity: { entity_type: 'Dataset' } } as FlaskDataContextType;

const sharedEntries = {
  edam_term: 'faketerm',
  description: 'fakedescription',
  size: 1000,
  type: 'faketype',
  mapped_description: 'fakemappeddescription',
  is_qa_qc: false,
};

export const testFiles: UnprocessedFile[] = [
  {
    rel_path: 'path1/path2/fake1.txt',
    ...sharedEntries,
    is_qa_qc: true,
  },
  {
    rel_path: 'path1/path2/fake2.txt',
    ...sharedEntries,
  },
  {
    rel_path: 'path1/fake3.txt',
    ...sharedEntries,
    is_qa_qc: true,
  },
  {
    rel_path: 'path3/fake4.txt',
    ...sharedEntries,
    is_data_product: true,
  },
  {
    rel_path: 'fake5.txt',
    ...sharedEntries,
    is_data_product: true,
  },
];

// This file just builds test fixtures: it has no tests of its own.
// eslint-disable-next-line jest/no-disabled-tests, jest/expect-expect
test.skip('skip', () => {
  /* purposely left empty */
});
