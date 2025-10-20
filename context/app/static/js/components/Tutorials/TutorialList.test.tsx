import React from 'react';
import { render, screen } from 'test-utils/functions';
import TutorialsList, { TutorialCard } from './TutorialList';
import { TutorialLandingPageContextProvider } from './TutorialLandingPageContext';
import { Tutorial } from './types';

// Mock tutorial data - must be defined before jest.mock
const mockTutorials: Tutorial[] = [
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
];

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
  TUTORIALS: mockTutorials,
}));

import { tutorialIsReady } from './utils';

describe('TutorialCard', () => {
  beforeEach(() => {
    (tutorialIsReady as jest.Mock).mockClear();
  });

  it('should render tutorial card with all information', () => {
    const tutorial = mockTutorials[0];
    (tutorialIsReady as jest.Mock).mockReturnValue(true);

    render(<TutorialCard tutorial={tutorial} />);

    expect(screen.getByText('Featured Tutorial 1')).toBeInTheDocument();
    expect(screen.getByText('This is a featured tutorial')).toBeInTheDocument();
    expect(screen.getByTestId('tags')).toHaveTextContent('Featured, Data');
    expect(screen.getByTestId('category')).toHaveTextContent('Data');
    expect(screen.getByTestId('tutorial-card')).toBeInTheDocument();
  });

  it('should render "View Tutorial" button when tutorial is ready', () => {
    const tutorial = mockTutorials[0];
    (tutorialIsReady as jest.Mock).mockReturnValue(true);

    render(<TutorialCard tutorial={tutorial} />);

    const button = screen.getByRole('button', { name: 'View Tutorial' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(button.closest('a')).toHaveAttribute('href', '/tutorials/featured-tutorial-1');
  });

  it('should render "Coming Soon" button when tutorial is not ready', () => {
    const tutorial = mockTutorials[3];
    (tutorialIsReady as jest.Mock).mockReturnValue(false);

    render(<TutorialCard tutorial={tutorial} />);

    const button = screen.getByRole('button', { name: 'Coming Soon' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});

describe('TutorialsList', () => {
  const renderWithProvider = (children: React.ReactNode = <TutorialsList />) => {
    return render(<TutorialLandingPageContextProvider>{children}</TutorialLandingPageContextProvider>);
  };

  beforeEach(() => {
    (tutorialIsReady as jest.Mock).mockImplementation((tutorial: Tutorial) => {
      return !!tutorial.iframeLink;
    });
  });

  it('should render featured tutorials section', () => {
    renderWithProvider();

    // Should show featured tutorial
    expect(screen.getByText('Featured Tutorial 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Tutorials')).toBeInTheDocument();
  });

  it('should render tutorials grouped by category', () => {
    renderWithProvider();

    // Should show category headers
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Visualization')).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();

    // Should show tutorials in each category
    expect(screen.getByText('Data Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Visualization Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon Tutorial')).toBeInTheDocument();
  });

  it('should sort tutorials alphabetically within categories', () => {
    renderWithProvider();

    const tutorialCards = screen.getAllByTestId('selectable-card');
    const tutorialTitles = tutorialCards.map((card) => card.querySelector('h3')?.textContent);

    // Featured tutorial should be first
    expect(tutorialTitles[0]).toBe('Featured Tutorial 1');

    // Within categories, tutorials should be sorted alphabetically
    const dataIndex = tutorialTitles.indexOf('Data Tutorial');
    const featuredIndex = tutorialTitles.indexOf('Featured Tutorial 1');

    // Both featured and data tutorials are in Data category, featured should come first alphabetically
    expect(featuredIndex).toBeLessThan(dataIndex);
  });

  it('should not render sections with no tutorials', () => {
    // Mock empty tutorials to test empty state
    jest.doMock('./types', () => ({
      ...jest.requireActual('./types'),
      TUTORIALS: [],
    }));

    renderWithProvider();

    // Should not render any tutorial content when no tutorials
    expect(screen.queryByText('Featured Tutorials')).not.toBeInTheDocument();
    expect(screen.queryByText('Data')).not.toBeInTheDocument();
  });

  it('should render category icons and descriptions', () => {
    renderWithProvider();

    // Check for category descriptions
    expect(screen.getByText(/Discover how to find, interpret, and download HuBMAP data/)).toBeInTheDocument();
    expect(screen.getByText(/Explore built-in visualization tools/)).toBeInTheDocument();
    expect(screen.getByText(/Learn how to launch and use workspaces/)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProvider();

    // Check for proper heading structure
    const categoryHeaders = screen.getAllByRole('banner');
    expect(categoryHeaders.length).toBeGreaterThan(0);

    // Check for proper IDs on category sections
    expect(screen.getByText('Data').closest('header')).toHaveAttribute('id', 'data');
    expect(screen.getByText('Visualization').closest('header')).toHaveAttribute('id', 'visualization');
    expect(screen.getByText('Workspaces').closest('header')).toHaveAttribute('id', 'workspaces');
  });
});
