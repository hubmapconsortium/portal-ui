import { SavedEntitiesList } from 'js/components/savedLists/types';

// The key used to store saved entities in the UKV
export const SAVED_ENTITIES_KEY = 'savedEntities';

// The key in local storage where saved entities were previously stored
export const SAVED_ENTITIES_LOCAL_STORAGE_KEY = 'saved_entities';

export const SAVED_ENTITIES_DEFAULT: SavedEntitiesList = {
  title: 'My Saved Items',
  description: '',
  dateSaved: Date.now(),
  dateLastModified: Date.now(),
  savedEntities: {},
};

export const SavedListsEventCategories = {
  Functionality: 'My Lists Functionality',
  LandingPage: 'My Lists Landing Page',
  DetailPage: 'My Lists Detail Page',
  EntityDetailPage: (entity_type: string) => `${entity_type} Page`,
  EntitySearchPage: (entity_type: string) => `${entity_type} Search Page Interactions`,
} as const;
