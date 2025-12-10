export interface SavedEntity {
  dateSaved?: number;
  dateAddedToList?: number;
}

export interface SavedEntitiesList {
  title: string;
  description: string;
  dateSaved: number;
  dateLastModified: number;
  savedEntities: Record<string, SavedEntity>;
}

export function validateSavedEntitiesList(obj: unknown): obj is SavedEntitiesList {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const requiredKeys = ['title', 'description', 'dateSaved', 'dateLastModified', 'savedEntities'];
  for (const key of requiredKeys) {
    if (!(key in obj)) {
      return false;
    }
  }

  if ('title' in obj && typeof (obj as SavedEntitiesList).title !== 'string') {
    return false;
  }

  if ('description' in obj && typeof (obj as SavedEntitiesList).description !== 'string') {
    return false;
  }

  if ('dateSaved' in obj && typeof (obj as SavedEntitiesList).dateSaved !== 'number') {
    return false;
  }

  if ('dateLastModified' in obj && typeof (obj as SavedEntitiesList).dateLastModified !== 'number') {
    return false;
  }

  if ('savedEntities' in obj) {
    const savedEntities = (obj as SavedEntitiesList).savedEntities;
    if (typeof savedEntities !== 'object' || savedEntities === null) {
      return false;
    }
  }

  return true;
}

export interface SavedPreferences {
  enableOpenKeyNav?: boolean;
}

export const SavedListsEventCategories = {
  Functionality: 'My Lists Functionality',
  LandingPage: 'My Lists Landing Page',
  DetailPage: 'My Lists Detail Page',
  EntityDetailPage: (entity_type: string) => `${entity_type} Page`,
  EntitySearchPage: (entity_type: string) => `${entity_type} Search Page Interactions`,
} as const;
