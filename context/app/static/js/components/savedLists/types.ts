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
