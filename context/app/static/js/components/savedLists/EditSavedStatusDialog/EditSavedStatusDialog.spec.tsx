import React from 'react';
import { render, screen } from 'test-utils/functions';

import useSavedLists from 'js/components/savedLists/hooks';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { SAVED_ENTITIES_KEY, SAVED_PREFERENCES_KEY } from 'js/components/savedLists/constants';
import EditSavedStatusDialog, { getSavedListsWhichContainEntity } from './EditSavedStatusDialog';

jest.mock('js/components/savedLists/hooks', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedUseSavedLists = useSavedLists as jest.MockedFunction<(...args: any[]) => any>;

function makeList(overrides: Partial<SavedEntitiesList> = {}): SavedEntitiesList {
  return {
    title: 'List',
    description: '',
    dateSaved: 0,
    dateLastModified: 0,
    savedEntities: {},
    ...overrides,
  };
}

describe('getSavedListsWhichContainEntity', () => {
  test('returns an empty array when there are no lists', () => {
    expect(getSavedListsWhichContainEntity({}, 'entity-1')).toEqual([]);
  });

  test('returns an empty array when no list contains the entity', () => {
    const lists = {
      'list-a': makeList({ savedEntities: { other: {} } }),
      'list-b': makeList({ savedEntities: {} }),
    };
    expect(getSavedListsWhichContainEntity(lists, 'entity-1')).toEqual([]);
  });

  test('returns the IDs of lists that contain the entity', () => {
    const lists = {
      'list-a': makeList({ savedEntities: { 'entity-1': {} } }),
      'list-b': makeList({ savedEntities: { other: {} } }),
      'list-c': makeList({ savedEntities: { 'entity-1': {}, other: {} } }),
    };
    expect(getSavedListsWhichContainEntity(lists, 'entity-1').sort()).toEqual(['list-a', 'list-c']);
  });
});

describe('EditSavedStatusDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Regression: passing `savedListsAndEntities` (which includes the reserved
   * `savedPreferences` entry without a `savedEntities` field) to
   * `getSavedListsWhichContainEntity` crashes the page with
   * "right-hand side of 'in' should be an object, got undefined".
   * The dialog should be insulated against that by using the filtered
   * `savedLists` record exposed by `useSavedLists`.
   */
  test('renders without crashing when reserved keys exist alongside lists', () => {
    const realList = makeList({ title: 'My Real List', savedEntities: { 'entity-1': {} } });

    mockedUseSavedLists.mockReturnValue({
      savedLists: { 'real-list-uuid': realList },
      // Intentionally include reserved keys here so this test would still pass
      // a regression that re-introduces reading from `savedListsAndEntities`
      // only if those reserved entries are *also* shaped like lists. They
      // aren't in practice — `savedPreferences` has no `savedEntities`
      // property — so the dialog must not read from this field directly.
      savedListsAndEntities: {
        'real-list-uuid': realList,
        [SAVED_ENTITIES_KEY]: makeList({ title: 'My Saved Items' }),
        [SAVED_PREFERENCES_KEY]: { enableOpenKeyNav: true },
      },
      handleAddEntitiesToList: jest.fn().mockResolvedValue(undefined),
      handleRemoveEntitiesFromList: jest.fn().mockResolvedValue(undefined),
    });

    render(<EditSavedStatusDialog dialogIsOpen setDialogIsOpen={jest.fn()} uuid="entity-1" />);

    expect(screen.getByText('My Real List')).toBeInTheDocument();
  });

  test('does not render reserved-key entries as selectable list rows', () => {
    mockedUseSavedLists.mockReturnValue({
      savedLists: { 'real-list-uuid': makeList({ title: 'My Real List' }) },
      savedListsAndEntities: {
        'real-list-uuid': makeList({ title: 'My Real List' }),
        [SAVED_ENTITIES_KEY]: makeList({ title: 'My Saved Items' }),
        [SAVED_PREFERENCES_KEY]: { enableOpenKeyNav: true },
      },
      handleAddEntitiesToList: jest.fn().mockResolvedValue(undefined),
      handleRemoveEntitiesFromList: jest.fn().mockResolvedValue(undefined),
    });

    render(<EditSavedStatusDialog dialogIsOpen setDialogIsOpen={jest.fn()} uuid="entity-1" />);

    expect(screen.getByText('My Real List')).toBeInTheDocument();
    expect(screen.queryByText('My Saved Items')).not.toBeInTheDocument();
  });

  test('pre-selects the lists that already contain the entity', () => {
    mockedUseSavedLists.mockReturnValue({
      savedLists: {
        'list-with-entity': makeList({ title: 'Contains Entity', savedEntities: { 'entity-1': {} } }),
        'list-without-entity': makeList({ title: 'Empty' }),
      },
      savedListsAndEntities: {},
      handleAddEntitiesToList: jest.fn().mockResolvedValue(undefined),
      handleRemoveEntitiesFromList: jest.fn().mockResolvedValue(undefined),
    });

    render(<EditSavedStatusDialog dialogIsOpen setDialogIsOpen={jest.fn()} uuid="entity-1" />);

    const containingRow = screen.getByText('Contains Entity').closest('li')!;
    const emptyRow = screen.getByText('Empty').closest('li')!;

    expect(containingRow.querySelector('input[type="checkbox"]')).toBeChecked();
    expect(emptyRow.querySelector('input[type="checkbox"]')).not.toBeChecked();
  });
});
