import { capitalizeString } from 'js/helpers/functions';
import { useCallback } from 'react';
import { SearchStoreState, useSearchStore } from './store';

function mapProcessingType(label: string) {
  if (label.toLowerCase() === 'hubmap') {
    return 'HuBMAP';
  }

  return capitalizeString(label);
}

type FieldConfigurations = Record<
  string,
  { label?: string; valueTransformations?: ((label: string) => string)[]; valueSort?: 'asc' | 'desc' | 'count' }
>;
function buildFieldConfigurations(type: SearchStoreState['type']): FieldConfigurations {
  return {
    age_value: {
      label: 'Age',
    },
    analyte_class: {
      label: 'Analyte Class',
      valueTransformations: [capitalizeString],
    },
    ancestor_ids: {
      label: 'Ancestor ID',
    },
    assay_display_name: {
      label: 'Data Types',
    },
    assay_modality: {
      label: 'Assay Modalities',
      valueTransformations: [capitalizeString],
    },
    body_mass_index_value: {
      label: 'BMI',
    },
    'calculated_metadata.annotation_tools': {
      label: 'Annotation Tools',
    },
    'calculated_metadata.object_types': {
      label: 'Annotations Available',
    },
    created_by_user_displayname: {
      label: 'Registered By',
    },
    created_timestamp: {
      label: 'Creation Date',
    },
    dataset_type: {
      label: 'Dataset Type',
    },
    'descendant_counts.entity_type.Dataset': {
      label: `Show ${type}s Without Datasets`,
    },
    'descendant_counts.entity_type.Publication': {
      label: `Show Only ${type}s Linked to Publications`,
    },
    descendant_ids: {
      label: 'Descendant ID',
    },
    'donor.mapped_metadata.age_value': {
      label: 'Donor Age',
    },
    'donor.mapped_metadata.body_mass_index_value': {
      label: 'Donor BMI',
    },
    'donor.mapped_metadata.race': {
      label: 'Donor Race',
    },
    'donor.mapped_metadata.sex': {
      label: 'Donor Sex',
    },
    entity_type: {
      label: 'Entity Type',
    },
    group_name: {
      label: 'Group',
    },
    hubmap_id: {
      label: 'HuBMAP ID',
    },
    is_component: {
      label: 'Component Dataset',
      valueTransformations: [capitalizeString],
    },
    last_modified_timestamp: {
      label: 'Last Modified Date',
    },
    mapped_consortium: {
      label: 'Consortium',
    },
    mapped_organ: {
      label: 'Organ',
    },
    mapped_status: {
      label: 'Status',
    },
    origin_samples_unique_mapped_organs: {
      label: 'Organ',
    },
    pipeline: {
      label: 'Pipeline',
      valueTransformations: [capitalizeString],
    },
    processing: {
      label: 'Processing',
      valueTransformations: [capitalizeString],
    },
    processing_type: {
      label: 'Processing Type',
      valueTransformations: [mapProcessingType],
    },
    published_timestamp: {
      label: 'Publication Date',
    },
    race: {
      label: 'Race',
    },
    raw_dataset_type: {
      label: 'Dataset Type',
      valueSort: 'asc',
    },
    sample_category: {
      label: 'Sample Category',
      valueTransformations: [capitalizeString],
    },
    sex: {
      label: 'Sex',
    },
    visualization: {
      label: 'Visualization Available',
      valueTransformations: [capitalizeString],
    },
    // Dev Search Fields
    'mapper_metadata.size': {
      label: 'Doc Size',
    },
    mapped_last_modified_timestamp: {
      label: 'Last Modified',
    },
    'mapper_metadata.version': {
      label: 'Mapper Version',
    },
    index_version: {
      label: 'Index Version',
    },
    anatomy_1: {
      label: 'Anatomy',
    },
    data_types: {
      label: 'Data Types',
    },
    'metadata.assay_type': {
      label: 'Assay Type',
    },
    'metadata.assay_category': {
      label: 'Assay Category',
    },
    'files.description': {
      label: 'File Description',
    },
    mapped_data_types: {
      label: 'Mapped Data Types',
    },
    sub_status: {
      label: 'Has Substatus',
    },
    'metadata.living_donor_data': {
      label: 'Has Living Donor Metadata',
    },
    'metadata.organ_donor_data': {
      label: 'Has Organ Donor Data',
    },
    metadata: {
      label: 'Has Metadata',
    },
    files: {
      label: 'Has Files',
    },
    rui_location: {
      label: 'Has RUI Location',
    },
    'mapper_metadata.validation_errors': {
      label: 'Has Mapper Validation Errors',
    },
    'mapper_metadata.validation_errors.absolute_path': {
      label: 'Mapper Validation Errors Absolute Path',
    },
    'mapper_metadata.validation_errors.absolute_schema_path': {
      label: 'Mapper Validation Errors Absolute Schema Path',
    },
    next_revision_uuid: {
      label: 'Has Next Revision',
    },
    previous_revision_uuid: {
      label: 'Has Previous Revision',
    },
  };
}

export function useFieldConfigurations() {
  const type = useSearchStore((state) => state.type);
  return buildFieldConfigurations(type);
}

export function getFieldConfigurations({
  field,
  fieldConfigurationsMap,
}: {
  field: string;
  fieldConfigurationsMap: FieldConfigurations;
}) {
  const exactMatch = fieldConfigurationsMap?.[field];

  const stem = field.split('.').pop();
  const stemMatch = stem && fieldConfigurationsMap?.[stem];

  return exactMatch ?? stemMatch ?? undefined;
}

export function useGetTransformedFieldValue() {
  const fieldConfigurations = useFieldConfigurations();

  return useCallback(
    ({ value, field }: { value: string; field: string }) => {
      const valueTransformations = getFieldConfigurations({
        field,
        fieldConfigurationsMap: fieldConfigurations,
      })?.valueTransformations;

      if (!valueTransformations) {
        return value;
      }
      return valueTransformations.reduce((l, transformFn) => transformFn(l), value);
    },
    [fieldConfigurations],
  );
}

export function useGetFieldLabel() {
  const fieldConfigurations = useFieldConfigurations();

  return useCallback(
    (field: string) => {
      const fieldLabel = getFieldConfigurations({
        field,
        fieldConfigurationsMap: fieldConfigurations,
      })?.label;

      return fieldLabel ?? field;
    },
    [fieldConfigurations],
  );
}

export function useFieldValueSort() {
  const fieldConfigurations = useFieldConfigurations();

  return useCallback(
    (field: string) => {
      const valueSort = getFieldConfigurations({
        field,
        fieldConfigurationsMap: fieldConfigurations,
      })?.valueSort;

      return valueSort ?? 'count';
    },
    [fieldConfigurations],
  );
}
