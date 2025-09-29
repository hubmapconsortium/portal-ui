import React from 'react';
import { render, screen } from 'test-utils/functions';

import Error from './Error';

// Mock the utils module to work around the use of window.location in getErrorTitleAndSubtitle
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  getErrorTitleAndSubtitle: jest.fn(),
}));

const mockGetErrorTitleAndSubtitle = jest.requireMock('./utils').getErrorTitleAndSubtitle;

describe('Error page', () => {
  test.each([
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Access Denied'],
    [404, 'Page Not Found'],
    [504, 'Gateway Timeout'],
    [500, 'Internal Server Error'],
  ])('%i error page displays correct titles %s', (errorCode, title) => {
    mockGetErrorTitleAndSubtitle.mockReturnValue({
      title,
      subtitle: `HTTP Error ${errorCode}: ${title}`,
    });

    render(<Error errorCode={errorCode} />);

    expect(screen.getByText(errorCode.toString(), { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText(title, { exact: false })).toHaveLength(2);
  });

  it('should display maintenance titles', () => {
    mockGetErrorTitleAndSubtitle.mockReturnValue({
      title: 'Portal Maintenance',
      subtitle: 'Portal unavailable for scheduled maintenance.',
    });

    render(<Error isMaintenancePage />);
    expect(screen.getByText('Portal Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Portal unavailable for scheduled maintenance.')).toBeInTheDocument();
  });

  it('should display titles for unexpected error codes', () => {
    mockGetErrorTitleAndSubtitle.mockReturnValue({
      title: 'Unexpected Error',
      subtitle: 'HTTP Error 502',
    });

    render(<Error errorCode={502} />);
    expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
    expect(screen.getByText('502', { exact: false })).toBeInTheDocument();
  });

  it('should display titles and message for error boundary', () => {
    const mockHref = 'https://example.com';

    mockGetErrorTitleAndSubtitle.mockReturnValue({
      title: 'Error',
      subtitle: `URL: ${mockHref}`,
    });

    render(<Error isErrorBoundary errorBoundaryMessage="Fake message" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(`URL: ${mockHref}`)).toBeInTheDocument();
    expect(screen.getByText('Fake message')).toBeInTheDocument();
  });
});
