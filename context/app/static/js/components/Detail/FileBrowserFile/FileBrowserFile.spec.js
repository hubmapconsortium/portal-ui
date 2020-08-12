/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
// import userEvent from '@testing-library/user-event';

import FileBrowserFile from './FileBrowserFile';
import DetailContext from '../context';
import FilesContext from '../Files/context';

const fakeOpenDUA = jest.fn();

const assetsEndpoint = 'fakeendpoint';
const uuid = 'fakeuuid';
const token = 'faketoken';

const FilesProviders = ({ children }) => {
  return (
    <DetailContext.Provider value={{ assetsEndpoint, uuid }}>
      <FilesContext.Provider value={{ openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' }}>
        {children}
      </FilesContext.Provider>
    </DetailContext.Provider>
  );
};

test('displays a link with correct href when dua is agreed to', () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

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

  const refToTest = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}?token=${token}`;

  expect(screen.getByRole('link')).toHaveAttribute('href', refToTest);
});

/*
test('displays file description tooltip correctly on hover', () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

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
      ;<FileBrowserFile fileObj={fileObj} depth={depth} />
    </FilesProviders>,
  );

  const descriptionToTest = `${fileObj.description} (Format: ${fileObj.edam_term})`;

  screen.getByLabelText('description');
  userEvent.hover(screen.getByLabelText('description'));
  expect(screen.getByText(descriptionToText);
  userEvent.unhover(screen.getByLabelText('description'));
});
*/

test('has correct left margin', () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

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

  // depth * indentation multiplier * 8px spacing unit
  const expectedMargin = depth * 1.5 * 8;

  expect(screen.getByTestId('file-indented-div')).toHaveStyle(`margin-left: ${expectedMargin}px`);
});
