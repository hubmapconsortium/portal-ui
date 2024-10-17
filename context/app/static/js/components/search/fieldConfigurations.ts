import { capitalizeString } from 'js/helpers/functions';

function mapProcessingType(label: string) {
  if (label.toLowerCase() === 'hubmap') {
    return 'HuBMAP';
  }

  return capitalizeString(label);
}

const fieldConfigurationsMap: Record<
  string,
  { label?: string; valueTransformations?: ((label: string) => string)[]; valueSort?: 'asc' | 'desc' | 'count' }
> = {
  age_value: { label: 'Donor Age' },
  ancestor_ids: { label: 'Ancestor ID' },
  analyte_class: { label: 'Analyte Class', valueTransformations: [capitalizeString] },
  assay_display_name: { label: 'Data Types' },
  assay_modality: { label: 'Assay Modalities', valueTransformations: [capitalizeString] },
  body_mass_index_value: { label: 'Donor BMI' },
  created_by_user_displayname: { label: 'Registered By' },
  dataset_type: { label: 'Dataset Type' },
  descendant_ids: { label: 'Descendant ID' },
  entity_type: { label: 'Entity Type' },
  group_name: { label: 'Group' },
  hubmap_id: { label: 'HuBMAP ID' },
  is_component: { label: 'Component Dataset', valueTransformations: [capitalizeString] },
  last_modified_timestamp: { label: 'Last Modified' },
  mapped_consortium: { label: 'Consortium' },
  mapped_organ: { label: 'Organ' },
  mapped_status: { label: 'Status' },
  origin_samples_unique_mapped_organs: { label: 'Organ' },
  pipeline: { label: 'Pipeline', valueTransformations: [capitalizeString] },
  processing: { label: 'Processing' },
  processing_type: { label: 'Processing Type', valueTransformations: [mapProcessingType] },
  race: { label: 'Donor Race' },
  raw_dataset_type: { label: 'Dataset Type', valueSort: 'asc' },
  sample_category: { label: 'Sample Category', valueTransformations: [capitalizeString] },
  sex: { label: 'Donor Sex' },
  visualization: { label: 'Visualization Available', valueTransformations: [capitalizeString] },
};

export function getFieldConfigurations(field: string) {
  const exactMatch = fieldConfigurationsMap?.[field];

  const stem = field.split('.').pop();
  const stemMatch = stem && fieldConfigurationsMap?.[stem];

  return exactMatch ?? stemMatch ?? undefined;
}

export function getTransformedFieldalue({ value, field }: { value: string; field: string }) {
  const valueTransformations = getFieldConfigurations(field)?.valueTransformations;

  if (!valueTransformations) {
    return value;
  }
  return valueTransformations.reduce((l, transformFn) => transformFn(l), value);
}

export function getFieldLabel(field: string) {
  const fieldLabel = getFieldConfigurations(field)?.label;

  return fieldLabel ?? field;
}

export function getFieldValueSort(field: string) {
  const valueSort = getFieldConfigurations(field)?.valueSort;

  return valueSort ?? 'count';
}
