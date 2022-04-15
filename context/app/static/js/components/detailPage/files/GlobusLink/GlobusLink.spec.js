/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import GlobusLink from './GlobusLink';

const uuid = 'fakeuuid';
const hubmap_id = 'fakedoi';

const globusUrlResponse = {
  url: 'fakeglobusurl',
};

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays success icon with 200 response', async () => {
  server.use(
    rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
      return res(ctx.json(globusUrlResponse), ctx.status(200));
    }),
  );
  render(<GlobusLink uuid={uuid} hubmap_id={hubmap_id} />);

  await screen.findByTestId('success-icon');
  expect(screen.getByText('Bulk Data Transfer')).toBeInTheDocument();
});

test('displays info icon with 500 response', async () => {
  server.use(
    rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  // error is expected: We don't want to see it in test logs.
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
  render(<GlobusLink uuid={uuid} hubmap_id={hubmap_id} />);

  await screen.findByTestId('error-icon');
  expect(screen.getByText('Bulk Data Transfer')).toBeInTheDocument();
});
