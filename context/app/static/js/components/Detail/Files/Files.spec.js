/* eslint-disable import/no-unresolved */
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitForElementToBeRemoved } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import Files from './Files';
import DetailContext from '../context';

const assetsEndpoint = 'fakeendpoint';
const uuid = 'fakeuuid';
const token = 'faketoken';
const mapped_data_access_level = 'fakeaccess';

const entityEndpoint = 'fakeendpoint';

const globusUrlResponse = {
  url: 'fakeglobusurl',
};

const server = setupServer(
  rest.get(`/${entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
    return res(ctx.json(globusUrlResponse), ctx.status(200));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const DetailProvider = ({ children }) => {
  return (
    <DetailContext.Provider value={{ assetsEndpoint, uuid, mapped_data_access_level }}>
      {children}
    </DetailContext.Provider>
  );
};

test('handles DUA flow', async () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

  const open = jest.fn();
  Object.defineProperty(window, 'open', { value: open });

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
    },
    {
      rel_path: 'path1/path2/fake2.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'path1/fake3.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'path3/fake4.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'fake5.txt',
      ...sharedEntries,
    },
  ];

  render(
    <DetailProvider>
      <Files files={testFiles} entityEndpoint={entityEndpoint} uuid={uuid} display_doi="fakedoi" />
    </DetailProvider>,
  );

  userEvent.click(screen.getByRole('button', { name: 'fake5.txt' }));
  expect(screen.getByLabelText('I have read and agree to the above data use guidelines.')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Disagree' }));
  await waitForElementToBeRemoved(() => screen.queryByText('I have read and agree to the above data use guidelines.'));

  userEvent.click(screen.getByRole('button', { name: 'fake5.txt' }));
  userEvent.click(screen.getByRole('checkbox'));
  userEvent.click(screen.getByRole('button', { name: 'Agree' }));

  expect(open).toHaveBeenCalled();
  await screen.findByRole('link', { name: 'fake5.txt' });
});

test('does not display file browser when files prop is undefined', async () => {
  const testFiles = undefined;

  render(
    <DetailProvider>
      <Files files={testFiles} entityEndpoint={entityEndpoint} uuid={uuid} display_doi="fakedoi" />
    </DetailProvider>,
  );

  expect(screen.queryByTestId('file-browser')).toBeNull();
});
