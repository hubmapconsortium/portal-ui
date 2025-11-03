import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import {
  TutorialLandingPageContextProvider,
  useTutorialsByCategory,
  useFeaturedTutorials,
  useTutorialLandingPageFilterCategory,
  useTutorialLandingPageSearch,
  useTutorialLandingPageTutorials,
  useSetTutorialLandingPageFilterCategory,
  useSetTutorialLandingPageSearch,
} from './TutorialLandingPageContext';

// Mock the TUTORIALS constant
jest.mock('./types', () => ({
  ...jest.requireActual('./types'),
  TUTORIALS: [
    {
      title: 'Test Tutorial 1',
      route: 'test-tutorial-1',
      description: 'This is a test tutorial about data',
      category: 'Data',
      tags: ['Test', 'Data'],
      iframeLink: 'https://example.com/tutorial1',
      isFeatured: true,
    },
    {
      title: 'Test Tutorial 2',
      route: 'test-tutorial-2',
      description: 'This is a visualization tutorial',
      category: 'Visualization',
      tags: ['Visualization', 'Charts'],
      iframeLink: 'https://example.com/tutorial2',
    },
    {
      title: 'Test Tutorial 3',
      route: 'test-tutorial-3',
      description: 'Another data tutorial with biomarker info',
      category: 'Data',
      tags: ['Biomarker', 'Analysis'],
      iframeLink: '',
    },
    {
      title: 'Workspaces Tutorial',
      route: 'workspaces-tutorial',
      description: 'Learn about workspaces',
      category: 'Workspaces',
      tags: ['Workspaces', 'Analysis'],
      iframeLink: 'https://example.com/workspaces',
      isFeatured: true,
    },
  ],
}));

// Test component to access hooks
const TestComponent = () => {
  const search = useTutorialLandingPageSearch();
  const filterCategory = useTutorialLandingPageFilterCategory();
  const tutorials = useTutorialLandingPageTutorials();

  const setSearch = useSetTutorialLandingPageSearch();
  const setFilterCategory = useSetTutorialLandingPageFilterCategory();

  return (
    <div>
      <div data-testid="search">{search}</div>
      <div data-testid="filter-category">{filterCategory || 'none'}</div>
      <div data-testid="tutorials-count">{tutorials.length}</div>
      <button data-testid="set-search" onClick={() => setSearch('data')}>
        Set Search
      </button>
      <button data-testid="set-filter" onClick={() => setFilterCategory('Visualization')}>
        Set Filter
      </button>
      <button data-testid="clear-filter" onClick={() => setFilterCategory(undefined)}>
        Clear Filter
      </button>
    </div>
  );
};

const TestCategoryComponent = ({ category }: { category: 'Data' }) => {
  const tutorials = useTutorialsByCategory(category);
  return <div data-testid="category-tutorials-count">{tutorials.length}</div>;
};

const TestFeaturedComponent = () => {
  const tutorials = useFeaturedTutorials();
  return <div data-testid="featured-tutorials-count">{tutorials.length}</div>;
};

describe('TutorialLandingPageContext', () => {
  const renderWithProvider = (children: React.ReactNode) => {
    return render(<TutorialLandingPageContextProvider>{children}</TutorialLandingPageContextProvider>);
  };

  describe('Context Provider and Hooks', () => {
    it('should provide initial state', () => {
      renderWithProvider(<TestComponent />);

      expect(screen.getByTestId('search')).toHaveTextContent('');
      expect(screen.getByTestId('filter-category')).toHaveTextContent('none');
      expect(screen.getByTestId('tutorials-count')).toHaveTextContent('4');
    });

    it('should update search and filter tutorials', () => {
      renderWithProvider(<TestComponent />);

      // Use fireEvent for more reliable event handling
      fireEvent.click(screen.getByTestId('set-search'));

      expect(screen.getByTestId('search')).toHaveTextContent('data');
      expect(screen.getByTestId('tutorials-count')).toHaveTextContent('2'); // Only tutorials with 'data' in title/description/tags
    });

    it('should filter by category', () => {
      renderWithProvider(<TestComponent />);

      // Use fireEvent for more reliable event handling
      fireEvent.click(screen.getByTestId('set-filter'));

      expect(screen.getByTestId('filter-category')).toHaveTextContent('Visualization');
      expect(screen.getByTestId('tutorials-count')).toHaveTextContent('1');
    });

    it('should clear category filter', () => {
      renderWithProvider(<TestComponent />);

      // Set filter first
      fireEvent.click(screen.getByTestId('set-filter'));
      expect(screen.getByTestId('tutorials-count')).toHaveTextContent('1');

      // Clear filter
      fireEvent.click(screen.getByTestId('clear-filter'));
      expect(screen.getByTestId('filter-category')).toHaveTextContent('none');
      expect(screen.getByTestId('tutorials-count')).toHaveTextContent('4');
    });
  });

  describe('useTutorialsByCategory', () => {
    it('should return tutorials for specific category', () => {
      renderWithProvider(<TestCategoryComponent category="Data" />);

      expect(screen.getByTestId('category-tutorials-count')).toHaveTextContent('2');
    });
  });

  describe('useFeaturedTutorials', () => {
    it('should return only featured tutorials', () => {
      renderWithProvider(<TestFeaturedComponent />);

      expect(screen.getByTestId('featured-tutorials-count')).toHaveTextContent('2');
    });
  });
});
