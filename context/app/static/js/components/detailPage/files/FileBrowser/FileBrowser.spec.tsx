import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils/functions';

import { FlaskDataContext } from 'js/components/Contexts';
import { DetailContext } from 'js/components/detailPage/DetailContext';
import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import FileBrowser from './FileBrowser';
import { FilesContext } from '../FilesContext';
import { detailContext, filesContext, flaskDataContext, testFiles } from '../file-fixtures.spec';
import { ProcessedDatasetContextProvider } from '../../ProcessedData/ProcessedDataset/ProcessedDatasetContext';
import { ProcessedDatasetDetails } from '../../ProcessedData/ProcessedDataset/hooks';

const expectArrayOfStringsToExist = (arr: string[]) =>
  arr.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
const expectArrayOfStringsToNotExist = (arr: string[]) =>
  arr.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());

function FilesBrowserTest() {
  return (
    <ProcessedDatasetContextProvider
      dataset={{ uuid: 'fakeuuid' } as unknown as ProcessedDatasetDetails}
      defaultExpanded
      sectionDataset={{ uuid: 'fakeparentuuid' } as unknown as ProcessedDatasetInfo}
    >
      <FlaskDataContext.Provider value={flaskDataContext}>
        <DetailContext.Provider value={detailContext}>
          <FilesContext.Provider value={filesContext}>
            <FileBrowser files={testFiles} />
          </FilesContext.Provider>
        </DetailContext.Provider>
      </FlaskDataContext.Provider>
    </ProcessedDatasetContextProvider>
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

interface TestParams {
  name: string;
  toggle: () => HTMLElement;
  textInDocumentAfter: string[];
  textNotInDocumentAfter: string[];
}

test.each<TestParams>([
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
])(
  'Displays correct files before and after display only $name chip is clicked',
  async ({ toggle, textInDocumentAfter, textNotInDocumentAfter }: TestParams) => {
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
