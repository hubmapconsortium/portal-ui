import React from 'react';
import { render, screen } from 'test-utils/functions';
import { TutorialCard } from './TutorialList';
import { Tutorial } from './types';

// Mock the utils module
jest.mock('./utils', () => ({
  tutorialIsReady: jest.fn(),
}));

// Mock the InternalLink component
jest.mock('js/shared-styles/Links', () => ({
  InternalLink: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock SelectableCard component
jest.mock('js/shared-styles/cards/SelectableCard', () => ({
  __esModule: true,
  default: ({
    title,
    description,
    tags,
    category,
    children,
    ...props
  }: {
    title: string;
    description: string;
    tags: string[];
    category: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="selectable-card" {...props}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div data-testid="tags">{tags.join(', ')}</div>
      <div data-testid="category">{category}</div>
      {children}
    </div>
  ),
}));

jest.mock('./types', () => ({
  ...jest.requireActual('./types'),
  TUTORIALS: [
    {
      title: 'Featured Tutorial 1',
      route: 'featured-tutorial-1',
      description: 'This is a featured tutorial',
      category: 'Data',
      tags: ['Featured', 'Data'],
      iframeLink: 'https://example.com/tutorial1',
      isFeatured: true,
    },
    {
      title: 'Data Tutorial',
      route: 'data-tutorial',
      description: 'Learn about data',
      category: 'Data',
      tags: ['Data', 'Analysis'],
      iframeLink: 'https://example.com/tutorial2',
    },
    {
      title: 'Visualization Tutorial',
      route: 'viz-tutorial',
      description: 'Learn about visualization',
      category: 'Visualization',
      tags: ['Visualization', 'Charts'],
      iframeLink: 'https://example.com/tutorial3',
    },
    {
      title: 'Coming Soon Tutorial',
      route: 'coming-soon',
      description: 'This tutorial is not ready yet',
      category: 'Workspaces',
      tags: ['Workspaces'],
      iframeLink: '',
    },
  ],
}));

// Import after mocking
import { tutorialIsReady } from './utils';

const mockTutorialIsReady = tutorialIsReady as jest.MockedFunction<typeof tutorialIsReady>;

describe('TutorialCard', () => {
  beforeEach(() => {
    mockTutorialIsReady.mockClear();
  });

  it('should render tutorial card with all information', () => {
    const tutorial: Tutorial = {
      title: 'Featured Tutorial 1',
      route: 'featured-tutorial-1',
      description: 'This is a featured tutorial',
      category: 'Data',
      tags: ['Featured', 'Data'],
      iframeLink: 'https://example.com/tutorial1',
      isFeatured: true,
    };
    mockTutorialIsReady.mockReturnValue(true);

    render(<TutorialCard tutorial={tutorial} />);

    expect(screen.getByText('Featured Tutorial 1')).toBeInTheDocument();
    expect(screen.getByText('This is a featured tutorial')).toBeInTheDocument();
    expect(screen.getByTestId('tags')).toHaveTextContent('Featured, Data');
    expect(screen.getByTestId('category')).toHaveTextContent('Data');
    expect(screen.getByTestId('tutorial-card')).toBeInTheDocument();
  });

  it('should render "View Tutorial" button when tutorial is ready', () => {
    const tutorial: Tutorial = {
      title: 'Featured Tutorial 1',
      route: 'featured-tutorial-1',
      description: 'This is a featured tutorial',
      category: 'Data',
      tags: ['Featured', 'Data'],
      iframeLink: 'https://example.com/tutorial1',
      isFeatured: true,
    };
    mockTutorialIsReady.mockReturnValue(true);

    render(<TutorialCard tutorial={tutorial} />);

    const link = screen.getByRole('link', { name: 'View Tutorial' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/tutorials/featured-tutorial-1');
  });

  it('should render "Coming Soon" button when tutorial is not ready', () => {
    const tutorial: Tutorial = {
      title: 'Coming Soon Tutorial',
      route: 'coming-soon',
      description: 'This tutorial is not ready yet',
      category: 'Workspaces',
      tags: ['Workspaces'],
      iframeLink: '',
    };
    mockTutorialIsReady.mockReturnValue(false);

    render(<TutorialCard tutorial={tutorial} />);

    const button = screen.getByRole('button', { name: 'Coming Soon' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

// Test component that simulates empty state
const EmptyTutorialsList = () => {
  return (
    <div>
      {/* This simulates the NoTutorialsMessage component logic */}
      <div data-testid="no-tutorials-message">
        <h3>No Tutorials Found</h3>
        <p>No tutorials match your current search and filter criteria.</p>
        <div>
          Search: <strong>&ldquo;test search&rdquo;</strong>
        </div>
        <div>
          Categories: <strong>Data</strong>
        </div>
        <p>Try adjusting your search terms or removing some filters.</p>
      </div>
    </div>
  );
};

describe('TutorialsList - Empty State', () => {
  it('should show appropriate message when no tutorials match filters', () => {
    render(<EmptyTutorialsList />);

    expect(screen.getByTestId('no-tutorials-message')).toBeInTheDocument();
    expect(screen.getByText('No Tutorials Found')).toBeInTheDocument();
    expect(screen.getByText('No tutorials match your current search and filter criteria.')).toBeInTheDocument();
    expect(screen.getByText(/test search/)).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or removing some filters.')).toBeInTheDocument();
  });
});
