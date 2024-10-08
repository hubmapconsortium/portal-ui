import { capitalizeString } from 'js/helpers/functions';

function mapProcessingType(label: string) {
  if (label.toLowerCase() === 'hubmap') {
    return 'HuBMAP';
  }

  return capitalizeString(label);
}

const labelTransformationMap: Record<string, ((label: string) => string)[]> = {
  analyte_class: [capitalizeString],
  assay_modality: [capitalizeString],
  is_component: [capitalizeString],
  processing: [capitalizeString],
  processing_type: [mapProcessingType],
  sample_category: [capitalizeString],
  visualization: [capitalizeString],
};

function getLabelTransformations(field: string) {
  const exactMatch = labelTransformationMap?.[field];

  const stem = field.split('.').pop();
  const stemMatch = stem && labelTransformationMap?.[stem];

  return exactMatch ?? stemMatch ?? undefined;
}

export function transformValueLabel({ label, field }: { label: string; field: string }) {
  const labelTransformations = getLabelTransformations(field);

  if (!labelTransformations) {
    return label;
  }
  return labelTransformations.reduce((l, transformFn) => transformFn(l), label);
}

export default transformValueLabel;
