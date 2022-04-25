import produce from 'immer';

import metadataFieldtoEntityMap from 'metadata-field-entities';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createFacet } from 'js/components/entity-search/SearchWrapper/utils';

const relatedEntityTypesMap = {
  donor: ['donor'],
  sample: ['donor', 'sample'],
  dataset: ['donor', 'sample'],
};

function useMetadataFieldConfigs() {
  const { entityType } = useStore();
  return Object.entries(metadataFieldtoEntityMap).reduce((acc, [fieldName, fieldEntityType]) => {
    if (relatedEntityTypesMap[entityType].includes(fieldEntityType)) {
      return produce(acc, (draft) => {
        const group = `${fieldEntityType} metadata`;
        // eslint-disable-next-line no-param-reassign
        return { ...draft, ...createFacet({ fieldName, label: fieldName, entityType, facetGroup: group }) };
      });
    }
    return acc;
  }, {});
}

export { useMetadataFieldConfigs };
