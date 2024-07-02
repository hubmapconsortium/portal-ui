export type DonorEntityType = 'Donor';
export type SampleEntityType = 'Sample';
export type DatasetEntityType = 'Dataset';
export type SupportEntityType = 'Support';
export type CollectionEntityType = 'Collection';
export type PublicationEntityType = 'Publication';

export type ESEntityType =
  | DonorEntityType
  | SampleEntityType
  | DatasetEntityType
  | SupportEntityType
  | CollectionEntityType
  | PublicationEntityType;

export type DagProvenanceType =
  | {
      origin: string;
    }
  | {
      name: string;
    };

export interface Entity {
  entity_type: ESEntityType;
  uuid: string;
  hubmap_id: string;
  last_modified_timestamp: number;
  created_timestamp: number;
  ancestors: Entity[];
  descendant_counts: { entity_type: Record<string, number> };
  metadata: {
    dag_provenance_list: DagProvenanceType[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Donor extends Entity {
  entity_type: 'Donor';
  mapped_metadata?: {
    sex: string;
    age_unit: string;
    age_value: string;
    race: string[];
  };
}

export interface Sample extends Entity {
  entity_type: 'Sample';
  sample_category?: string;
  mapped_organ: string;
  organ: string;
  origin_samples_unique_mapped_organs: string[];
}

export interface Dataset extends Entity {
  entity_type: 'Dataset';
  processing: 'raw' | 'processed';
  assay_display_name: string;
  is_component?: boolean;
  assay_modality: 'single' | 'multiple';
  donor: Donor;
  mapped_data_access_level: 'Public' | 'Protected' | 'Consortium';
  origin_samples: Sample[];
  origin_samples_unique_mapped_organs: string[];
  mapped_data_types: string[];
  thumbnail_file?: {
    file_uuid: string;
  };
}

export interface Collection extends Entity {
  entity_type: 'Collection';
}

export interface Publication extends Entity {
  entity_type: 'Publication';
}

export interface Support extends Entity {
  entity_type: 'Support';
}

export type EntityWithType = Partial<Entity> & Required<Pick<Entity, 'entity_type'>>;

function checkEntityType(entity: EntityWithType, entityType: ESEntityType): boolean {
  return entity.entity_type === entityType;
}

export function isDataset(entity: EntityWithType): entity is Dataset {
  return checkEntityType(entity, 'Dataset');
}

export function isSample(entity: EntityWithType): entity is Sample {
  return checkEntityType(entity, 'Sample');
}

export function isDonor(entity: EntityWithType): entity is Donor {
  return checkEntityType(entity, 'Donor');
}

export function isCollection(entity: EntityWithType): entity is Collection {
  return checkEntityType(entity, 'Collection');
}

export function isPublication(entity: EntityWithType): entity is Publication {
  return checkEntityType(entity, 'Publication');
}

export function isSupport(entity: EntityWithType): entity is Support {
  return checkEntityType(entity, 'Support');
}
