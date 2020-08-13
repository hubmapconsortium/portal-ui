/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import GlobusLink from './GlobusLink';

const token = 'faketoken';
const uuid = 'fakeuuid';
const entityEndpoint = 'fakeendpoint';
const display_doi = 'fakedoi';

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

test('displays progress bar when loading and success icon with 200 response', async () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

  render(<GlobusLink uuid={uuid} entityEndpoint={entityEndpoint} display_doi={display_doi} />);

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await screen.findByText('Bulk Data Transfer');
  expect(screen.getByTestId('success-icon')).toBeInTheDocument();
});

test('displays info icon with 500 response', async () => {
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: `nexus_token=${token}`,
  });

  server.use(
    rest.get(`/${entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  render(<GlobusLink uuid={uuid} entityEndpoint={entityEndpoint} display_doi={display_doi} />);

  await screen.findByText('Bulk Data Transfer');
  expect(screen.getByTestId('info-icon')).toBeInTheDocument();
});
