import React from 'react';
import { render, screen, act, fireEvent } from 'test-utils/functions';

import { trackEvent } from 'js/helpers/trackers';
import { SearchStoreProvider, SearchStoreState } from '../store';
import TopSearchBar from './TopSearchBar';

const mockTrackEvent = jest.mocked(trackEvent);

function buildInitialState(overrides: Partial<SearchStoreState> = {}): SearchStoreState {
  return {
    search: '',
    filters: {},
    initialFilters: {},
    facets: {},
    searchFields: [],
    sourceFields: { table: [], tile: [] },
    sortField: { field: 'last_modified_timestamp', direction: 'desc' as const },
    view: 'table',
    size: 18,
    endpoint: 'fakeEndpoint',
    type: 'Dataset' as const,
    analyticsCategory: 'Test Search',
    ...overrides,
  } as SearchStoreState;
}

function renderWithStore(overrides?: Partial<SearchStoreState>) {
  return render(
    <SearchStoreProvider initialState={buildInitialState(overrides)}>
      <TopSearchBar />
    </SearchStoreProvider>,
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  mockTrackEvent.mockClear();
});

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  jest.useRealTimers();
});

describe('TopSearchBar', () => {
  it('initializes the input from the search store', () => {
    renderWithStore({ search: 'tissue sample' });
    expect(screen.getByPlaceholderText('Search')).toHaveValue('tissue sample');
  });

  it('debounces typing into a single trackEvent call with the analytics category', () => {
    renderWithStore();
    const input = screen.getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: 'k' } });
    fireEvent.change(input, { target: { value: 'ki' } });
    fireEvent.change(input, { target: { value: 'kid' } });
    fireEvent.change(input, { target: { value: 'kidn' } });
    expect(mockTrackEvent).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Test Search',
      action: 'Search',
      label: 'kidn',
    });
  });

  it('does not flush its debounced commit after unmount', () => {
    const { unmount } = renderWithStore();
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'lung' } });

    unmount();
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});
