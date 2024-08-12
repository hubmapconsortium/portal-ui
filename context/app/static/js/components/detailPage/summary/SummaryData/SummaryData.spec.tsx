import React from 'react';
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { http, HttpResponse } from 'msw';
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
  http.get(`/${appProviderEndpoints.entityEndpoint}/datasets/${testUUID}/revisions`, () => {
    return HttpResponse.json(versionResponse);
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('dataset displays properly', () => {
  render(<SummaryData entity_type="Dataset" status="QA" mapped_data_access_level="Public" />);
  expect(screen.getByText('QA (Public)')).toBeInTheDocument();
  expect(screen.getByTestId('status-svg-icon')).toBeInTheDocument();
});

test('non-dataset displays properly', () => {
  render(<SummaryData entity_type="Sample" status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('status-svg-icon')).not.toBeInTheDocument();
});

test('children display when provided', () => {
  render(
    <SummaryData entity_type="Dataset" status="QA" mapped_data_access_level="Public">
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
  render(<SummaryData entity_type="Dataset" status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('summary-data-parent')).not.toBeInTheDocument();
});
