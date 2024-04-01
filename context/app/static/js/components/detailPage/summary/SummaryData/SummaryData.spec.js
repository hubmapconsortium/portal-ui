import React from 'react';
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import SummaryData from './SummaryData';

const testUUID = 'fakeuuid';

const versionResponse = [
  {
    revision_number: 1,
    dataset_uuid: testUUID,
  },
];

const server = setupServer(
  rest.get(`/${appProviderEndpoints.entityEndpoint}/datasets/${testUUID}/revisions`, (req, res, ctx) => {
    return res(ctx.json(versionResponse, ctx.status(200)));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('json button exists and has href', () => {
  render(<SummaryData entity_type="Fake" uuid={testUUID} status="QA" mapped_data_access_level="Public" />);

  expect(screen.getByRole('link')).not.toBeEmptyDOMElement();
  expect(screen.getByRole('link')).toHaveAttribute('href', `/browse/fake/fakeuuid.json`);
});

test('dataset displays properly', async () => {
  render(<SummaryData entity_type="Dataset" uuid={testUUID} status="QA" mapped_data_access_level="Public" />);
  const textToTest = ['QA', 'Public Access'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  expect(screen.getByTestId('status-svg-icon')).toBeInTheDocument();

  await screen.findByText('Version 1');
});

test('non-dataset displays properly', () => {
  render(<SummaryData entity_type="fake" uuid={testUUID} status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('status-svg-icon')).not.toBeInTheDocument();
});

test('children display when provided', () => {
  render(
    <SummaryData entity_type="fake" uuid={testUUID} status="QA" mapped_data_access_level="Public">
      <div>child 1</div>
      <div>child 2</div>
    </SummaryData>,
  );
  expect(screen.getByTestId('summary-data-parent')).toBeInTheDocument();
  expect(screen.getByTestId('summary-data-parent')).not.toBeEmptyDOMElement();

  const textToTest = ['child 1', 'child 2'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('children do not display when undefined', () => {
  render(<SummaryData entity_type="fake" uuid={testUUID} status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('summary-data-parent')).not.toBeInTheDocument();
});
