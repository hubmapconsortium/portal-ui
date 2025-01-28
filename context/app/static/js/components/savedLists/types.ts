interface UkvAPIFailure {
  success: false;
  message: string;
  data: undefined;
}

interface UkvAPISuccess<Data> {
  success: true;
  message: string;
  data: Data;
}

export type UkvAPIResponse<Data> = UkvAPIFailure | UkvAPISuccess<Data>;

export type UkvAPIResponseWithoutData = Omit<UkvAPIResponse<undefined>, 'data'>;

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

interface SavedEntitiesState {
  savedEntities: Record<string, SavedEntity>;
  savedLists: Record<string, SavedEntitiesList>;
  listsToBeDeleted: string[];
}

interface SavedEntitiesActions {
  setEntities: (entities: Record<string, SavedEntity>) => void;
  setLists: (lists: Record<string, SavedEntitiesList>) => void;
  saveEntity: (entityUUID: string) => void;
  saveEntities: (entityUUIDs: Set<string>) => void;
  deleteEntity: (entityUUID: string) => void;
  deleteEntities: (entityUUIDs: Set<string>) => void;
  createList: (list: Pick<SavedEntitiesList, 'title' | 'description'>, uuid: string) => void;
  addEntityToList: (listUUID: string, entityUUID: string) => void;
  addEntitiesToList: (listUUID: string, entityUUIDs: string[]) => void;
  removeEntityFromList: (listUUID: string, entityUUID: string) => void;
  removeEntitiesFromList: (listUUID: string, entityUUIDs: string[]) => void;
  queueListToBeDeleted: (listUUID: string) => void;
  deleteQueuedLists: () => void;
  deleteList: (listUUID: string) => void;
  editList: (list: Pick<SavedEntitiesList, 'title' | 'description'> & { listUUID: string }) => void;
}

export type SavedEntitiesStore = SavedEntitiesState & SavedEntitiesActions;
