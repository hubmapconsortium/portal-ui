import { Sample } from 'js/components/Contexts';

export interface EntityData {
  thumbnail_file?: {
    file_uuid: string;
  };
  sample_category?: string;
  mapped_data_types: string[];
  origin_samples: Sample[];
  origin_samples_unique_mapped_organs: string[];
  mapped_metadata?: {
    sex: string;
    age_value: number;
    age_unit: string;
    race: string[];
  };
  last_modified_timestamp: number;
}
