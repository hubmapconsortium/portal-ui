/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import GlobusLinkMessage from './GlobusLinkMessage';
import DetailContext from '../context';
import FilesContext from '../Files/context';

const fakeOpenDUA = jest.fn();
const assetsEndpoint = 'fakeendpoint';
const uuid = 'fakeuuid';

const FilesProviders = ({ children }) => {
  return (
    <DetailContext.Provider value={{ assetsEndpoint, uuid }}>
      <FilesContext.Provider value={{ openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' }}>
        {children}
      </FilesContext.Provider>
    </DetailContext.Provider>
  );
};

const url = 'fakeurl';
const display_doi = 'fake_doi';

test('displays 200 correctly', () => {
  render(
    <FilesProviders>
      <GlobusLinkMessage statusCode={200} url={url} display_doi={display_doi} />
    </FilesProviders>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `fakeurl`);
  expect(screen.getByRole('link')).toHaveTextContent('Globus');
  expect(
    screen.getByText(
      `Files are available through the Globus Research Data Management System. Access dataset ${display_doi} on`,
      { exact: false },
    ),
  ).toBeInTheDocument();
});

const messages = {
  401: 'Unauthorized access to the Globus Research Management System (bad or expired token). If you believe this to be an error, please contact',
  403: 'Access to files on the Globus Research Management system are restricted. You may not have access to these files because the Consortium is still curating data and/or the data is protected data that requires you to be a member of the Consortium “Protected Data Group”. Such protected data will be available via dbGaP in the future. If you believe this to be an error, please contact',
  404: 'Files are not available through the Globus Research Management system. If you believe this to be an error, please contact',
  500: 'Unexpected server or other error. Report error to',
};
test.each(Object.entries(messages))('displays %i message correctly', (code, expected) => {
  render(
    <FilesProviders>
      <GlobusLinkMessage statusCode={parseInt(code, 10)} url={url} display_doi={display_doi} />
    </FilesProviders>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `mailto:help@hubmapconsortium.org`);
  expect(screen.getByRole('link')).toHaveTextContent('help@hubmapconsortium.org');
  expect(screen.getByText(expected, { exact: false })).toBeInTheDocument();
});
