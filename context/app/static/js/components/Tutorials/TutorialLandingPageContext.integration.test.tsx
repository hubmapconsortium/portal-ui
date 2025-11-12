import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import {
  TutorialLandingPageContextProvider,
  useSetTutorialLandingPageFilterCategories,
  useToggleTutorialLandingPageFilterCategory,
  useSetTutorialLandingPageSearch,
  useTutorialLandingPageFilterCategories,
  useTutorialLandingPageSearch,
  useTutorialLandingPageTutorials,
} from './TutorialLandingPageContext';

// Simple test component to access hooks
const TestComponent = () => {
  const search = useTutorialLandingPageSearch();
  const filterCategories = useTutorialLandingPageFilterCategories();
  const tutorials = useTutorialLandingPageTutorials();

  const setSearch = useSetTutorialLandingPageSearch();
  const setFilterCategories = useSetTutorialLandingPageFilterCategories();
  const toggleFilterCategory = useToggleTutorialLandingPageFilterCategory();

  return (
    <div>
      <div data-testid="search">{search}</div>
      <div data-testid="filter-categories">{filterCategories.join(', ') || 'none'}</div>
      <div data-testid="tutorials-count">{tutorials.length}</div>
      <button data-testid="set-search" onClick={() => setSearch('data')}>
        Set Search
      </button>
      <button data-testid="set-filter" onClick={() => setFilterCategories(['Data'])}>
        Set Filter
      </button>
      <button data-testid="toggle-data" onClick={() => toggleFilterCategory('Data')}>
        Toggle Data
      </button>
      <button data-testid="clear-filter" onClick={() => setFilterCategories([])}>
        Clear Filter
      </button>
    </div>
  );
};

describe('TutorialLandingPageContext Integration', () => {
  const renderWithProvider = () => {
    return render(
      <TutorialLandingPageContextProvider>
        <TestComponent />
      </TutorialLandingPageContextProvider>,
    );
  };

  it('should provide initial state', () => {
    renderWithProvider();

    expect(screen.getByTestId('search')).toHaveTextContent('');
    expect(screen.getByTestId('filter-categories')).toHaveTextContent('none');
    // Should have some tutorials from the real data
    expect(screen.getByTestId('tutorials-count')).not.toHaveTextContent('0');
  });

  it('should update search state', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('set-search'));
    expect(screen.getByTestId('search')).toHaveTextContent('data');
  });

  it('should update filter state', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('set-filter'));
    expect(screen.getByTestId('filter-categories')).toHaveTextContent('Data');
  });

  it('should toggle filter category', () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId('toggle-data'));
    expect(screen.getByTestId('filter-categories')).toHaveTextContent('Data');
  });

  it('should clear filter state', () => {
    renderWithProvider();

    // Set filter first
    fireEvent.click(screen.getByTestId('set-filter'));
    expect(screen.getByTestId('filter-categories')).toHaveTextContent('Data');

    // Clear filter
    fireEvent.click(screen.getByTestId('clear-filter'));
    expect(screen.getByTestId('filter-categories')).toHaveTextContent('none');
  });
});
