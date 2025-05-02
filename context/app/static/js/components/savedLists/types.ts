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

export const SavedListsEventCategories = {
  Functionality: 'My Lists Functionality',
  LandingPage: 'My Lists Landing Page',
  DetailPage: 'My Lists Detail Page',
  EntityDetailPage: (entity_type: string) => `${entity_type} Page`,
  EntitySearchPage: (entity_type: string) => `${entity_type} Search Page Interactions`,
} as const;
