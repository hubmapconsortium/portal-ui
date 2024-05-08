export interface DonorMappedMetadata {
  age_value: string;
  age_unit: string;
  body_mass_index_value: string;
  body_mass_index_unit: string;
  sex: string;
  race: string[];
}

export interface CellsResultsDataset {
  hubmap_id: string;
  uuid: string;
  origin_samples_unique_mapped_organs: string[];
  mapped_data_types: string[];
  donor: {
    mapped_metadata: DonorMappedMetadata;
  };
  last_modified_timestamp: string;
}

export interface WrappedCellsResultsDataset {
  _id: string;
  _source: CellsResultsDataset;
}
