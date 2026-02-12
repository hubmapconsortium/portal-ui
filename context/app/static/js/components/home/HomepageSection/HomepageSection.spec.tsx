import React from 'react';
import { render, screen } from 'test-utils/functions';
import { BiotechRounded } from '@mui/icons-material';

import HomepageSection from './HomepageSection';

describe('HomepageSection', () => {
  test('renders title and children', () => {
    render(
      <HomepageSection title="Test Section" icon={BiotechRounded} gridArea="test">
        <div>Section content</div>
      </HomepageSection>,
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  test('renders actionButtons when provided', () => {
    render(
      <HomepageSection
        title="Test Section"
        icon={BiotechRounded}
        gridArea="test"
        actionButtons={<button type="button">Download</button>}
      >
        <div>Content</div>
      </HomepageSection>,
    );
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  test('does not render actionButtons container content when not provided', () => {
    render(
      <HomepageSection title="Test Section" icon={BiotechRounded} gridArea="test">
        <div>Content</div>
      </HomepageSection>,
    );
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
  });

  test('applies gridArea to the root element', () => {
    const { container } = render(
      <HomepageSection title="Test Section" icon={BiotechRounded} gridArea="my-grid-area">
        <div>Content</div>
      </HomepageSection>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveStyle({ gridArea: 'my-grid-area' });
  });

  test('renders with id when provided', () => {
    render(
      <HomepageSection title="Test Section" icon={BiotechRounded} gridArea="test" id="test-id">
        <div>Content</div>
      </HomepageSection>,
    );
    expect(screen.getByText('Test Section').closest('[id="test-id"]')).toBeInTheDocument();
  });
});
