import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import TutorialsSearchBar from './TutorialsSearchBar';
import { TutorialLandingPageContextProvider } from './TutorialLandingPageContext';

// Mock the SearchBar component
jest.mock('js/shared-styles/inputs/SearchBar', () => ({
  __esModule: true,
  default: ({
    placeholder,
    value,
    onChange,
    onBlur,
    ...props
  }: {
    placeholder: string;
    value: string;
    onChange: (e: unknown) => void;
    onBlur: () => void;
    [key: string]: unknown;
  }) => (
    <input
      data-testid="search-bar"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  ),
}));

// Mock the trackEvent function
jest.mock('js/helpers/trackers', () => ({
  trackEvent: jest.fn(),
}));

jest.mock('./types', () => ({
  ...jest.requireActual('./types'),
  TUTORIALS: [
    {
      title: 'Data Tutorial',
      route: 'data-tutorial',
      description: 'Learn about data analysis',
      category: 'Data',
      tags: ['Data', 'Analysis'],
      iframeLink: 'https://example.com/tutorial1',
    },
    {
      title: 'Visualization Tutorial',
      route: 'viz-tutorial',
      description: 'Learn about data visualization',
      category: 'Visualization',
      tags: ['Visualization', 'Charts'],
      iframeLink: 'https://example.com/tutorial2',
    },
  ],
}));

// Import the mocked function
import { trackEvent } from 'js/helpers/trackers';
const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

describe('TutorialsSearchBar', () => {
  const renderWithProvider = () => {
    return render(
      <TutorialLandingPageContextProvider>
        <TutorialsSearchBar />
      </TutorialLandingPageContextProvider>,
    );
  };

  beforeEach(() => {
    mockTrackEvent.mockClear();
  });

  it('should render search bar with correct placeholder', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveAttribute('placeholder', 'Search tutorials by title or keyword.');
  });

  it('should have empty value initially', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toHaveValue('');
  });

  it('should update search value when user types', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    fireEvent.change(searchBar, { target: { value: 'data' } });

    expect(searchBar).toHaveValue('data');
  });

  it('should clear search value when input is cleared', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    // Type something first
    fireEvent.change(searchBar, { target: { value: 'data' } });
    expect(searchBar).toHaveValue('data');

    // Clear the input
    fireEvent.change(searchBar, { target: { value: '' } });
    expect(searchBar).toHaveValue('');
  });

  it('should track search event when input loses focus', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    // Type a search term
    fireEvent.change(searchBar, { target: { value: 'visualization' } });

    // Trigger blur event
    fireEvent.blur(searchBar);

    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: 'visualization',
    });
  });

  it('should track empty search when blurring with no input', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    // Trigger blur without typing anything
    fireEvent.blur(searchBar);

    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: '',
    });
  });

  it('should track multiple different search terms', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    // First search
    fireEvent.change(searchBar, { target: { value: 'data' } });
    fireEvent.blur(searchBar);

    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: 'data',
    });

    // Focus back and search for something else
    fireEvent.focus(searchBar);
    fireEvent.change(searchBar, { target: { value: 'charts' } });
    fireEvent.blur(searchBar);

    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: 'charts',
    });

    expect(mockTrackEvent).toHaveBeenCalledTimes(2);
  });

  it('should handle special characters in search', () => {
    renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');
    const specialText = 'data-analysis & visualization!';

    fireEvent.change(searchBar, { target: { value: specialText } });
    expect(searchBar).toHaveValue(specialText);

    fireEvent.blur(searchBar);
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Tutorials Landing Page',
      action: 'Search Bar',
      label: specialText,
    });
  });

  it('should maintain search value across re-renders', () => {
    const { rerender } = renderWithProvider();

    const searchBar = screen.getByTestId('search-bar');

    // Type a search term
    fireEvent.change(searchBar, { target: { value: 'persistent search' } });
    expect(searchBar).toHaveValue('persistent search');

    // Re-render the component
    rerender(
      <TutorialLandingPageContextProvider>
        <TutorialsSearchBar />
      </TutorialLandingPageContextProvider>,
    );

    // Value should persist
    const newSearchBar = screen.getByTestId('search-bar');
    expect(newSearchBar).toHaveValue('persistent search');
  });
});
