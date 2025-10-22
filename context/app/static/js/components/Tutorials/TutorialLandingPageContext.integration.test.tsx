import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import {
  TutorialLandingPageContextProvider,
  useTutorialLandingPageSearchData,
  useTutorialLandingPageSearchActions,
} from './TutorialLandingPageContext';

// Simple test component to access hooks
const TestComponent = () => {
  const data = useTutorialLandingPageSearchData();
  const actions = useTutorialLandingPageSearchActions();

  return (
    <div>
      <div data-testid="search">{data.search}</div>
      <div data-testid="filter-category">{data.filterCategory || 'none'}</div>
      <div data-testid="tutorials-count">{data.tutorials.length}</div>
      <button data-testid="set-search" onClick={() => actions.setSearch('data')}>
        Set Search
      </button>
      <button data-testid="set-filter" onClick={() => actions.setFilterCategory('Data')}>
        Set Filter
      </button>
      <button data-testid="clear-filter" onClick={() => actions.setFilterCategory(undefined)}>
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
    expect(screen.getByTestId('filter-category')).toHaveTextContent('none');
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
    expect(screen.getByTestId('filter-category')).toHaveTextContent('Data');
  });

  it('should clear filter state', () => {
    renderWithProvider();

    // Set filter first
    fireEvent.click(screen.getByTestId('set-filter'));
    expect(screen.getByTestId('filter-category')).toHaveTextContent('Data');

    // Clear filter
    fireEvent.click(screen.getByTestId('clear-filter'));
    expect(screen.getByTestId('filter-category')).toHaveTextContent('none');
  });
});
