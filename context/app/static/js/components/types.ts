export type DonorEntityType = 'Donor';
export type SampleEntityType = 'Sample';
export type DatasetEntityType = 'Dataset';
export type DataEntityType = DonorEntityType | SampleEntityType | DatasetEntityType;
export type CellTypeEntityType = 'CellType';
export type GeneEntityType = 'Gene';
export type VerifiedUserEntityType = 'VerifiedUser';
export type ExternalEntityType = CellTypeEntityType | GeneEntityType | VerifiedUserEntityType;
export type WorkspaceEntityType = 'Workspace';
export type SupportEntityType = 'Support';
export type CollectionEntityType = 'Collection';
export type PublicationEntityType = 'Publication';
export type InternalEntityType = WorkspaceEntityType | SupportEntityType | PublicationEntityType | CollectionEntityType;

export type AllEntityTypes = DataEntityType | ExternalEntityType | InternalEntityType;

export type DagProvenanceType =
  | {
      origin: string;
    }
  | {
      name: string;
    };

export interface Entity {
  entity_type: DataEntityType;
  uuid: string;
  hubmap_id: string;
  last_modified_timestamp: number;
  created_timestamp: number;
  ancestors: Entity[];
  descendant_counts: { entity_type: Record<string, number> };
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
  metadata?: Record<string, string>;
}

export interface Dataset extends Entity {
  entity_type: 'Dataset';
  processing: 'raw' | 'processed';
  assay_display_name: string;
  is_component?: boolean;
  assay_modality: 'single' | 'multiple';
  donor: Donor;
  mapped_data_access_level: 'Public' | 'Protected' | 'Consortium';
  metadata: {
    dag_provenance_list: DagProvenanceType[];
    [key: string]: unknown;
  };
  origin_samples: Sample[];
  origin_samples_unique_mapped_organs: string[];
  mapped_data_types: string[];
  thumbnail_file?: {
    file_uuid: string;
  };
}

function checkEntityType(entity: Entity, entityType: DataEntityType): boolean {
  return entity.entity_type === entityType;
}

export function isDataset(entity: unknown): entity is Dataset {
  return checkEntityType(entity as Entity, 'Dataset');
}

export function isSample(entity: unknown): entity is Sample {
  return checkEntityType(entity as Entity, 'Sample');
}

export function isDonor(entity: unknown): entity is Donor {
  return checkEntityType(entity as Entity, 'Donor');
}
