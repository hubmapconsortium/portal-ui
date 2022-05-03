import produce from 'immer';

import metadataFieldtoEntityMap from 'metadata-field-entities';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createFacet } from 'js/components/entity-search/SearchWrapper/utils';
import { capitalizeString } from 'js/helpers/functions';
import { getMetadataFieldsSortedByEntityTypeThenFieldName } from './utils';

const relatedEntityTypesMap = {
  donor: ['donor'],
  sample: ['donor', 'sample'],
  dataset: ['donor', 'sample'],
};

const sortedMetadataFields = getMetadataFieldsSortedByEntityTypeThenFieldName(metadataFieldtoEntityMap);

function useMetadataFieldConfigs(initialFieldConfigs) {
  const { entityType } = useStore();
  return sortedMetadataFields.reduce(
    (acc, { fieldName, fieldEntityType }) => {
      if (relatedEntityTypesMap[entityType].includes(fieldEntityType)) {
        return produce(acc, (draft) => {
          const group = `${capitalizeString(fieldEntityType)} Metadata`;
          return {
            ...draft,
            ...createFacet({ fieldName, entityType, facetGroup: group }),
          };
        });
      }
      return acc;
    },
    { ...initialFieldConfigs },
  );
}

export { useMetadataFieldConfigs };
