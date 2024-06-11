const labelMap: Record<string, string> = {
  hubmap_id: 'HuBMAP ID',
  group_name: 'Group',
  assay_display_name: 'Data Types',
  mapped_organ: 'Organ',
  mapped_status: 'Status',
  dataset_type: 'Dataset Type',
  last_modified_timestamp: 'Last Modified',
  age_value: 'Donor Age',
  entity_type: 'Entity Type',
};

export function getFieldLabel(field: string) {
  const exactLabel = labelMap?.[field];

  const stem = field.split('.').pop();
  const stemLabel = stem && labelMap?.[stem];

  return exactLabel ?? stemLabel ?? field;
}

export default labelMap;
