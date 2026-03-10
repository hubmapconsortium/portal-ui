import React from 'react';
import { render, waitFor } from 'test-utils/functions';
import useSavedLists from 'js/components/savedLists/hooks';
import SavedList from './SavedList';

jest.mock('js/components/savedLists/hooks', () => ({
  __esModule: true,
  default: jest.fn(),
})); // Mock the hook

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseSavedLists = useSavedLists as jest.MockedFunction<(...args: any[]) => any>;

describe('SavedList component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock instances and calls
  });

  test('throws error when listUUID is not in savedLists', () => {
    const listUUID = 'any-uuid';

    // Setup the mock to return savedLists as an empty object
    mockedUseSavedLists.mockReturnValue({
      savedLists: {},
      isLoading: false,
      mutate: jest.fn(),
    });

    // Suppress console.error for this test since we're testing an error scenario
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<SavedList listUUID={listUUID} />)).toThrow('This list does not exist.');

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('renders without error when listUUID is in savedLists', async () => {
    const listUUID = 'any-uuid';

    // Mock the hook to return savedLists with a list
    mockedUseSavedLists.mockReturnValue({
      savedLists: {
        [listUUID]: {
          title: 'test title',
          description: 'test description',
          savedEntities: {},
          dateSaved: Date.now(),
          dateLastModified: Date.now(),
        },
      },
      isLoading: false,
      mutate: jest.fn(),
    });

    const { container } = render(<SavedList listUUID={listUUID} />);

    // Wait for the component to render with fetched data
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });
});
