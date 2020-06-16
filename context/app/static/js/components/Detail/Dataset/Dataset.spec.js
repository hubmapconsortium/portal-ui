/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
import React from 'react';
import 'whatwg-fetch'; // polyfill fetch
import { render } from 'test-utils/functions';
import { screen } from '@testing-library/react';
import mocks from 'test-utils/__mocks__/dataset/requests';
import { baseAssayMetadata, entityEndpoint, assetsEndpoint } from 'test-utils/__mocks__/dataset/props';
import { setupServer } from 'msw/node';
import Dataset from './Dataset';

const server = setupServer(...mocks);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('async sections render', async () => {
  render(
    <Dataset
      assayMetadata={baseAssayMetadata}
      vitData={{}}
      entityEndpoint={entityEndpoint}
      assetsEndpoint={assetsEndpoint}
    />,
  );
  const provText = await screen.findAllByText('Provenance');
  expect(provText.length).toBe(2);
  const provTableDonor = await screen.findByText('Donor');
  expect(provTableDonor).toBeVisible();
});

test('non-async sections render', async () => {
  const { getByText, getAllByText } = render(
    <Dataset
      assayMetadata={baseAssayMetadata}
      vitData={{}}
      entityEndpoint={entityEndpoint}
      assetsEndpoint={assetsEndpoint}
    />,
  );

  const fileText = getAllByText('Files');
  expect(fileText.length).toBe(2);
  expect(getByText('Summary')).toBeVisible();
});
