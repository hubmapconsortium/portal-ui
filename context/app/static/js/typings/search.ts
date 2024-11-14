export interface DescendantCounts {
  entity_type: { Dataset?: number; Sample?: number };
}

export interface EntityDocument {
  uuid: string;
  hubmap_id: string;
  created_timestamp: number;
  descendant_counts: DescendantCounts;
}

export interface DonorMappedMetadata {
  age_value: number;
  age_unit: string;
  sex: string;
  race: string;
}

export interface DonorDocument extends EntityDocument {
  mapped_metadata: DonorMappedMetadata;
}

interface SampleDatasetSharedFields {
  donor: DonorDocument;
  origin_samples_unique_mapped_organs: string[];
}

export interface SampleDocument extends EntityDocument, SampleDatasetSharedFields {
  donor: DonorDocument;
  origin_samples: Omit<SampleDocument, 'descendant_counts' | 'origin_samples'>;
}

export interface DatasetDocument extends EntityDocument, SampleDatasetSharedFields {
  mapped_data_access_level: string;
  mapped_data_types: string[];
  mapped_status: string;
  origin_samples: Omit<SampleDocument, 'descendant_counts' | 'origin_samples'>;
}
