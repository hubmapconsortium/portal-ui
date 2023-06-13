import { getFieldFromHitFields } from 'js/components/entity-search/ResultsTable/utils';

function getByPath(hitSource, field) {
  const fieldValue = getFieldFromHitFields(hitSource, field.id);

  if ('translations' in field) {
    return field.translations[fieldValue];
  }

  if (Array.isArray(fieldValue)) {
    return fieldValue.join(' / ');
  }

  return fieldValue;
}

export { getByPath };
