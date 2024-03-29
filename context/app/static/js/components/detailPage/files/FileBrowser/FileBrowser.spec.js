import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils/functions';

import { FlaskDataContext } from 'js/components/Contexts';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import FileBrowser from './FileBrowser';
import { FilesContext } from '../FilesContext';

const fakeOpenDUA = jest.fn();

const uuid = 'fakeuuid';

const detailContext = { uuid };
const filesContext = { openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' };
const flaskDataContext = { entity: { entity_type: 'Dataset' } };

const expectArrayOfStringsToExist = (arr) => arr.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
const expectArrayOfStringsToNotExist = (arr) =>
  arr.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());

const sharedEntries = {
  edam_term: 'faketerm',
  description: 'fakedescription',
  size: 1000,
  type: 'faketype',
};

const testFiles = [
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

function FilesBrowserTest() {
  return (
    <FlaskDataContext.Provider value={flaskDataContext}>
      <DetailContext.Provider value={detailContext}>
        <FilesContext.Provider value={filesContext}>
          <FileBrowser files={testFiles} />
        </FilesContext.Provider>
      </DetailContext.Provider>
    </FlaskDataContext.Provider>
  );
}

const fileBrowser = {
  get togglePath1Directory() {
    return screen.getByRole('button', { name: 'path1' });
  },
  get toggleQaFilesOnly() {
    return screen.getByRole('button', { name: 'Show QA Files' });
  },
  get toggleDataProductsOnly() {
    return screen.getByRole('button', { name: 'Show Data Products Files' });
  },
};

const defaultTextInDocument = ['path1', 'path3', 'fake5.txt'];
const defaultTextNotInDocument = ['path2', 'fake1.txt', 'fake2.txt', 'fake3.txt', 'fake4.txt'];

test('displays files and directories', async () => {
  render(<FilesBrowserTest />);

  expectArrayOfStringsToExist(defaultTextInDocument);

  expectArrayOfStringsToNotExist(defaultTextNotInDocument);

  await userEvent.click(fileBrowser.togglePath1Directory);

  const textInDocumentAfterOpenDirectory = [...defaultTextInDocument, 'fake3.txt', 'path2'];
  expectArrayOfStringsToExist(textInDocumentAfterOpenDirectory);
});

test.each(
  [
    {
      name: 'QA Files',
      toggle: () => fileBrowser.toggleQaFilesOnly,
      textInDocumentAfter: ['path1', 'path2', 'fake3.txt', 'fake1.txt'],
      textNotInDocumentAfter: ['path3', 'fake4.txt', 'fake2.txt', 'fake5.txt'],
    },
    {
      name: 'Data Products Files',
      toggle: () => fileBrowser.toggleDataProductsOnly,
      textInDocumentAfter: ['path3', 'fake5.txt', 'fake4.txt'],
      textNotInDocumentAfter: ['path1', 'path2', 'fake3.txt', 'fake1.txt', 'fake2.txt'],
    },
  ],
  'Displays correct files before and after display only $name chip is clicked',
  async ({ toggle, textInDocumentAfter, textNotInDocumentAfter }) => {
    render(<FilesBrowserTest />);

    // initial
    expectArrayOfStringsToExist(defaultTextInDocument);
    expectArrayOfStringsToNotExist(defaultTextNotInDocument);

    await userEvent.click(toggle());

    // after chip is clicked
    expectArrayOfStringsToExist(textInDocumentAfter);

    expectArrayOfStringsToNotExist(textNotInDocumentAfter);

    await userEvent.click(toggle());

    // returns to all dirs closed
    expectArrayOfStringsToExist(defaultTextInDocument);
    expectArrayOfStringsToNotExist(defaultTextNotInDocument);
  },
);
