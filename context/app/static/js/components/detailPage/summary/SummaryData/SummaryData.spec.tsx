import React from 'react';
// Plain RTL render: a composed story already carries the preview's `Providers` decorator,
// so wrapping it again in the one from test-utils would nest two of them.
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { composeStories, mockEndpoints } from 'test-utils/storybook';

import * as stories from './SummaryData.stories';

const { Default, Dataset, WithChildren } = composeStories(stories);

const testUUID = 'fakeuuid';

const versionResponse = [
  {
    revision_number: 1,
    dataset_uuid: testUUID,
  },
];

// The composed stories run under the preview's `Providers`, so `entityEndpoint` is the
// Storybook mock rather than the one from test-utils.
const server = setupServer(
  http.get(`${mockEndpoints.entityEndpoint}/datasets/${testUUID}/revisions`, () => {
    return HttpResponse.json(versionResponse);
  }),
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

test('dataset displays properly', () => {
  render(<Dataset />);
  expect(screen.getByText('QA (Public)')).toBeInTheDocument();
  expect(screen.getByTestId('status-svg-icon')).toBeInTheDocument();
});

test('non-dataset displays properly', () => {
  render(<Default />);
  expect(screen.queryByTestId('status-svg-icon')).not.toBeInTheDocument();
});

test('children display when provided', () => {
  render(<WithChildren />);
  expect(screen.getByTestId('summary-data-parent')).toBeInTheDocument();
  expect(screen.getByTestId('summary-data-parent')).not.toBeEmptyDOMElement();

  // The story renders eight children, labelled from zero.
  ['Child 0', 'Child 7'].forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});

test('children do not display when undefined', () => {
  render(<Dataset />);
  expect(screen.queryByTestId('summary-data-parent')).not.toBeInTheDocument();
});
