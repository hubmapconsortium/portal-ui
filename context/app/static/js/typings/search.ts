export interface DescendantCounts {
  entity_type: { Dataset?: number; Sample?: number };
}

export interface EntityDocument {
  uuid: string;
  hubmap_id: string;
  last_modified_timestamp: number;
  created_timestamp: number;
  descendant_counts: DescendantCounts;
  mapped_status: string;
  mapped_data_access_level: string;
  entity_type: string;
}

export interface DonorMappedMetadata {
  age_value: number;
  age_unit: string;
  body_mass_index_unit: string;
  body_mass_index_value: number;
  sex: string;
  race: string;
}

export interface DonorDocument extends EntityDocument {
  mapped_metadata: DonorMappedMetadata;
  entity_type: 'Donor';
}

interface SampleDatasetSharedFields {
  donor: DonorDocument;
  origin_samples_unique_mapped_organs: string[];
}

export interface SampleDocument extends EntityDocument, SampleDatasetSharedFields {
  donor: DonorDocument;
  origin_samples: Omit<SampleDocument, 'descendant_counts' | 'origin_samples'>;
  entity_type: 'Sample';
  anatomy_1: string | string[];
  anatomy_2: string | string[];
}

export interface DatasetDocument extends EntityDocument, SampleDatasetSharedFields {
  description: string;
  mapped_data_access_level: string;
  mapped_data_types: string[];
  mapped_status: string;
  origin_samples: Omit<SampleDocument, 'descendant_counts' | 'origin_samples'>;
  entity_type: 'Dataset';
}
