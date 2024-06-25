const labelMap: Record<string, string> = {
  hubmap_id: 'HuBMAP ID',
  group_name: 'Group',
  assay_display_name: 'Data Types',
  mapped_organ: 'Organ',
  mapped_status: 'Status',
  dataset_type: 'Dataset Type',
  last_modified_timestamp: 'Last Modified',
  entity_type: 'Entity Type',
  origin_samples_unique_mapped_organs: 'Organ',
  analyte_class: 'Analyte Class',
  sample_category: 'Sample Category',
  processing: 'Processing',
  pipeline: 'Pipeline',
  visualization: 'Visualization',
  processing_type: 'Processing Type',
  assay_modality: 'Assay Modalities',
  sex: 'Donor Sex',
  age_value: 'Donor Age',
  race: 'Donor Race',
  body_mass_index_value: 'Donor BMI',
};

export function getFieldLabel(field: string) {
  const exactLabel = labelMap?.[field];

  const stem = field.split('.').pop();
  const stemLabel = stem && labelMap?.[stem];

  return exactLabel ?? stemLabel ?? field;
}

export default labelMap;
