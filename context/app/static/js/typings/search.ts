export interface EntityDocument {
  uuid: string;
  hubmap_id: string;
  last_modified_timestamp: number;
}

export interface DonorMappedMetadata {
  age_value: number;
  age_unit: string;
  sex: string;
  race: string;
}

export interface DonorDocument extends EntityDocument {
  mapped_metadata?: DonorMappedMetadata;
}

export interface DescendantCounts {
  entity_type: { Dataset?: number; Sample?: number };
}

export interface SampleDocument extends EntityDocument {
  donor: DonorDocument;
  descendant_counts: DescendantCounts;
}

export interface DatasetDocument extends EntityDocument {
  donor: DonorDocument;
  descendant_counts: DescendantCounts;
}
