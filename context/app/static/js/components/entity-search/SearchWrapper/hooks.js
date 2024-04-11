import { useMemo } from 'react';

import metadataFieldtoEntityMap from 'metadata-field-entities';
import metadataFieldtoTypeMap from 'metadata-field-types';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';
import relatedEntityTypesMap from 'js/components/entity-search/SearchWrapper/relatedEntityTypesMap';
import useSearchData from 'js/hooks/useSearchData';

const numericTypes = new Set(['number', 'integer']);

// These fields are incorrectly typed as text in ES and cannot be treated as numbers.
const fieldsWithIncorrectEsType = new Set([
  'cold_ischemia_time_value',
  'specimen_tumor_distance_value',
  'warm_ischemia_time_value',
]);

function getNumericFieldStatsQuery(entityType) {
  return Object.entries(metadataFieldtoTypeMap).reduce(
    (acc, [fieldName, fieldEsType]) => {
      if (
        relatedEntityTypesMap[entityType].includes(metadataFieldtoEntityMap[fieldName]) &&
        numericTypes.has(fieldEsType) &&
        !fieldsWithIncorrectEsType.has(fieldName)
      ) {
        // createField returns an object with only a single value.
        const { field } = Object.values(createField({ fieldName, entityType }))[0];
        acc.aggs[field] = { stats: { field } };
        return acc;
      }
      return acc;
    },
    {
      aggs: {},
      size: 0,
    },
  );
}

function useNumericFieldsStats(entityType) {
  const query = useMemo(() => getNumericFieldStatsQuery(entityType), [entityType]);
  const {
    searchData: { aggregations: fieldsStats },
  } = useSearchData(query);

  return fieldsStats || {};
}

function buildNumericFacetsProps(fieldsStats) {
  return Object.entries(fieldsStats).reduce((acc, [fieldName, fieldStats]) => {
    if (fieldStats.count === 0) {
      return acc;
    }
    const max = Math.ceil(fieldStats.max);
    const min = Math.floor(fieldStats.min);

    acc[fieldName] = {
      max,
      min,
      interval: Math.max(Math.floor((max - min) / 20), 1),
    };

    return acc;
  }, {});
}

function useNumericFacetsProps(entityType) {
  const fieldsStats = useNumericFieldsStats(entityType);
  return buildNumericFacetsProps(fieldsStats);
}

export { useNumericFacetsProps, buildNumericFacetsProps };
