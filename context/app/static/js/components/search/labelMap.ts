const labelMap: Record<string, string> = {
  age_value: 'Donor Age',
  analyte_class: 'Analyte Class',
  assay_display_name: 'Data Types',
  assay_modality: 'Assay Modalities',
  body_mass_index_value: 'Donor BMI',
  created_by_user_displayname: 'Registered By',
  dataset_type: 'Dataset Type',
  entity_type: 'Entity Type',
  group_name: 'Group',
  hubmap_id: 'HuBMAP ID',
  is_component: 'Component Dataset',
  last_modified_timestamp: 'Last Modified',
  mapped_consortium: 'Consortium',
  mapped_organ: 'Organ',
  mapped_status: 'Status',
  origin_samples_unique_mapped_organs: 'Organ',
  pipeline: 'Pipeline',
  processing: 'Processing',
  processing_type: 'Processing Type',
  race: 'Donor Race',
  raw_dataset_type: 'Dataset Type',
  sample_category: 'Sample Category',
  sex: 'Donor Sex',
  visualization: 'Visualization Available',
};

export function getFieldLabel(field: string) {
  const exactLabel = labelMap?.[field];

  const stem = field.split('.').pop();
  const stemLabel = stem && labelMap?.[stem];

  return exactLabel ?? stemLabel ?? field;
}

export default labelMap;
