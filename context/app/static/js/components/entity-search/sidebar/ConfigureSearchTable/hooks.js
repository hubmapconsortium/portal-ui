import produce from 'immer';

import metadataFieldtoEntityMap from 'metadata-field-entities';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createFacet } from 'js/components/entity-search/SearchWrapper/utils';
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
          const group = `${fieldEntityType} Metadata`;
          // eslint-disable-next-line no-param-reassign
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
