import produce from 'immer';

import metadataFieldtoEntityMap from 'metadata-field-entities';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';

const relatedEntityTypesMap = {
  donor: ['donor'],
  sample: ['donor', 'sample'],
  dataset: ['donor', 'sample'],
};

function useMetadataFieldConfigs(initialFieldConfigs) {
  const { entityType } = useStore();
  return Object.entries(metadataFieldtoEntityMap).reduce(
    (acc, [fieldName, fieldEntityType]) => {
      if (relatedEntityTypesMap[entityType].includes(fieldEntityType)) {
        return produce(acc, (draft) => {
          return {
            ...draft,
            ...createField({ fieldName, entityType }),
          };
        });
      }
      return acc;
    },
    { ...initialFieldConfigs },
  );
}

export { useMetadataFieldConfigs };
