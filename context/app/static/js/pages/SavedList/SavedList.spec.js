import React from 'react';
import { render } from 'test-utils/functions';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import SavedList from './SavedList';

jest.mock('js/stores/useSavedEntitiesStore'); // Mock the hook

describe('SavedList component', () => {
  beforeEach(() => {
    useSavedEntitiesStore.mockClear(); // Clear all instances and calls to the mock
  });

  test('throws error when listUUID is not in savedLists', () => {
    // Setup the mock to return savedLists as an empty object
    useSavedEntitiesStore.mockImplementation(() => ({
      savedLists: {},
      removeEntitiesFromList: jest.fn(),
    }));

    const listUUID = 'any-uuid';

    // Suppress console.error for this test since we're testing an error scenario
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => render(<SavedList listUUID={listUUID} />)).toThrow('This list does not exist.');

    // Restore console.error
    console.error = originalConsoleError;
  });

  test('renders without error when listUUID is in savedLists', () => {
    const listUUID = 'any-uuid';

    useSavedEntitiesStore.mockImplementation(() => ({
      savedLists: {
        [listUUID]: {
          title: 'test title',
          description: 'test description',
          savedEntities: {},
          dateSaved: Date.now(),
          dateLastModified: Date.now(),
        },
      }, // Setup the mock to return savedLists with a list
      removeEntitiesFromList: jest.fn(),
    }));

    const { container } = render(<SavedList listUUID={listUUID} />);

    expect(container).toBeInTheDocument();
  });
});
