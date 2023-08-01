import React from 'react';
import { render, screen, appProviderEndpoints, appProviderToken } from 'test-utils/functions';
// import userEvent from '@testing-library/user-event';

import { DetailContext } from 'js/components/detailPage/context';
import FileBrowserFile from './FileBrowserFile';
import { FilesContext } from '../Files/context';

const fakeOpenDUA = jest.fn();

const uuid = 'fakeuuid';

const detailContext = { uuid };
const filesContext = { openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' };

function FilesProviders({ children }) {
  return (
    <DetailContext.Provider value={detailContext}>
      <FilesContext.Provider value={filesContext}>{children}</FilesContext.Provider>
    </DetailContext.Provider>
  );
}

test('displays a link with correct href when dua is agreed to', () => {
  const fileObj = {
    rel_path: 'fakepath',
    edam_term: 'faketerm',
    description: 'fakedescription',
    file: 'fakefile',
    size: 1000,
  };

  const depth = 0;

  render(
    <FilesProviders>
      <FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  const refToTest = `${appProviderEndpoints.assetsEndpoint}/${uuid}/${fileObj.rel_path}?token=${appProviderToken}`;

  expect(screen.getByRole('link')).toHaveAttribute('href', refToTest);
});

test('has correct left margin', () => {
  const fileObj = {
    rel_path: 'fakepath',
    edam_term: 'faketerm',
    description: 'fakedescription',
    file: 'fakefile',
    size: 1000,
  };

  const depth = 3;

  render(
    <FilesProviders>
      <FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  // depth * indentation multiplier * 8px spacing unit + 24px arrow icon offset
  const expectedMargin = depth * 1.5 * 8 + 24;
  expect(screen.getByTestId('file-indented-div')).toHaveStyle(`margin-left: ${expectedMargin}px`);
});

test('displays QA chip when is_qa_qc is true', () => {
  const fileObj = {
    rel_path: 'fakepath',
    edam_term: 'faketerm',
    description: 'fakedescription',
    file: 'fakefile',
    is_qa_qc: true,
    size: 1000,
  };

  const depth = 0;

  render(
    <FilesProviders>
      <FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  expect(screen.getByText('QA')).toBeInTheDocument();
});

test('does not display QA chip when is_qa_qc is not provided', () => {
  const fileObj = {
    rel_path: 'fakepath',
    edam_term: 'faketerm',
    description: 'fakedescription',
    file: 'fakefile',
    size: 1000,
  };

  const depth = 0;

  render(
    <FilesProviders>
      <FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  expect(screen.queryByText('QA')).not.toBeInTheDocument();
});

test('does not display QA chip when is_qa_qc is false', () => {
  const fileObj = {
    rel_path: 'fakepath',
    edam_term: 'faketerm',
    description: 'fakedescription',
    file: 'fakefile',
    size: 1000,
    is_qa_qc: false,
  };

  const depth = 0;

  render(
    <FilesProviders>
      <FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  expect(screen.queryByText('QA')).not.toBeInTheDocument();
});
