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

test('displays files and directories', () => {
  render(<FilesBrowserTest />);

  expectArrayOfStringsToExist(defaultTextInDocument);

  expectArrayOfStringsToNotExist(defaultTextNotInDocument);

  userEvent.click(fileBrowser.togglePath1Directory);

  const textInDocumentAfterOpenDirectory = [...defaultTextInDocument, 'fake3.txt', 'path2'];
  expectArrayOfStringsToExist(textInDocumentAfterOpenDirectory);
});

test('Displays correct files before and after display only QA files chip is clicked', () => {
  render(<FilesBrowserTest />);

  // initial
  expectArrayOfStringsToExist(defaultTextInDocument);
  expectArrayOfStringsToNotExist(defaultTextNotInDocument);

  userEvent.click(fileBrowser.toggleQaFilesOnly);

  // after QA files chip clicked
  const textInDocumentAfterQAFilesOnly = ['path1', 'path2', 'fake3.txt', 'fake1.txt'];
  expectArrayOfStringsToExist(textInDocumentAfterQAFilesOnly);

  const textNotInDocumentAfterQAFilesOnly = ['path3', 'fake4.txt', 'fake2.txt', 'fake5.txt'];
  expectArrayOfStringsToNotExist(textNotInDocumentAfterQAFilesOnly);

  userEvent.click(fileBrowser.toggleQaFilesOnly);

  // returns to all dirs closed
  expectArrayOfStringsToExist(defaultTextInDocument);
  expectArrayOfStringsToNotExist(defaultTextNotInDocument);
});

test('Displays correct files before and after display only data products files chip is clicked', () => {
  render(<FilesBrowserTest />);

  // initial
  expectArrayOfStringsToExist(defaultTextInDocument);
  expectArrayOfStringsToNotExist(defaultTextNotInDocument);

  userEvent.click(fileBrowser.toggleDataProductsOnly);

  // after data products files chip clicked
  const textInDocumentAfterDataProductsOnly = ['path3', 'fake5.txt', 'fake4.txt'];
  expectArrayOfStringsToExist(textInDocumentAfterDataProductsOnly);
  const textNotInDocumentAfterDataProductsOnly = ['path1', 'path2', 'fake3.txt', 'fake1.txt', 'fake2.txt'];
  expectArrayOfStringsToNotExist(textNotInDocumentAfterDataProductsOnly);

  userEvent.click(fileBrowser.toggleDataProductsOnly);

  // returns to all dirs closed
  expectArrayOfStringsToExist(defaultTextInDocument);
  expectArrayOfStringsToNotExist(defaultTextNotInDocument);
});
