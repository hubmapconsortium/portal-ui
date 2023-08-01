import React from 'react';
import { render } from '@testing-library/react';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import SavedList from './SavedList';

jest.mock('js/stores/useSavedEntitiesStore'); // Mock the hook

describe('SavedList component', () => {
  beforeEach(() => {
    useSavedEntitiesStore.mockClear(); // Clear all instances and calls to the mock
  });

  test('renders without crash when savedLists is empty', () => {
    // Setup the mock to return savedLists as an empty object
    useSavedEntitiesStore.mockImplementation(() => ({
      savedLists: {},
      removeEntitiesFromList: jest.fn(),
    }));

    // Here you need to provide a listUUID that would exist in the savedLists.
    // Since the mock returns an empty savedLists object, it could be any string.
    const listUUID = 'any-uuid';

    const { container } = render(<SavedList listUUID={listUUID} />);

    expect(container).toBeInTheDocument();
  });
});
