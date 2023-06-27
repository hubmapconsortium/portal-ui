/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import DetailContext from 'js/components/detailPage/context';
import GlobusLinkMessage from './GlobusLinkMessage';
import FilesContext from '../Files/context';

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

const url = 'fakeurl';
const hubmap_id = 'fake_doi';

test('displays 200 correctly', () => {
  render(
    <FilesProviders>
      <GlobusLinkMessage statusCode={200} url={url} hubmap_id={hubmap_id} />
    </FilesProviders>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `fakeurl`);
  expect(screen.getByRole('link')).toHaveTextContent('Globus');
  expect(
    screen.getByText(
      `Files are available through the Globus Research Data Management System. Access dataset ${hubmap_id} on`,
      { exact: false },
    ),
  ).toBeInTheDocument();
});

const messages = {
  401: 'Unauthorized access to the Globus Research Management System',
  403: 'Access to files on the Globus Research Management system is restricted',
  404: 'Files are not available through the Globus Research Management system',
  500: 'Unexpected server or other error',
};
test.each(Object.entries(messages))('displays %i message correctly', (code, expected) => {
  render(
    <FilesProviders>
      <GlobusLinkMessage statusCode={parseInt(code, 10)} url={url} hubmap_id={hubmap_id} />
    </FilesProviders>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `mailto:help@hubmapconsortium.org`);
  expect(screen.getByRole('link')).toHaveTextContent('help@hubmapconsortium.org');
  expect(screen.getByText(expected, { exact: false })).toBeInTheDocument();
});
