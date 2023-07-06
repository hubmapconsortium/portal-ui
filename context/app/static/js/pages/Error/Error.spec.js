import React from 'react';
import { render, screen } from 'test-utils/functions';

import Error from './Error';

test.each([
  [400, 'Bad Request'],
  [401, 'Unauthorized'],
  [403, 'Access Denied'],
  [404, 'Page Not Found'],
  [504, 'Gateway Timeout'],
  [500, 'Internal Server Error'],
])('%i error page displays correct titles %s', (errorCode, title) => {
  render(<Error errorCode={errorCode} />);

  expect(screen.getByText(errorCode.toString(), { exact: false })).toBeInTheDocument();
  expect(screen.getAllByText(title, { exact: false })).toHaveLength(2);
});

test('should display maintenance titles', () => {
  render(<Error isMaintenancePage />);
  expect(screen.getByText('Portal Maintenance')).toBeInTheDocument();
  expect(screen.getByText('Portal unavailable for scheduled maintenance.')).toBeInTheDocument();
});

test('should display titles for unexpected error codes', () => {
  render(<Error errorCode={502} />);
  expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
  expect(screen.getByText('502', { exact: false })).toBeInTheDocument();
});

test('should display titles and message for error boundary', () => {
  global.window = Object.create(window);
  const url = 'http://fake.com';
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
  });
  render(<Error isErrorBoundary errorBoundaryMessage="Fake message" />);
  expect(screen.getByText('Error')).toBeInTheDocument();
  expect(screen.getByText(`URL: ${url}`)).toBeInTheDocument();
  expect(screen.getByText('Fake message')).toBeInTheDocument();
});
