import useSavedEntityData from 'js/hooks/useSavedEntityData';
import { getSearchHitsEntityCounts } from 'js/helpers/functions';

const source = ['entity_type']; // 'memoize' to prevent infinite loop

function useSavedEntityTypeCounts(listSavedEntities) {
  const { searchHits } = useSavedEntityData(listSavedEntities, source);
  return getSearchHitsEntityCounts(searchHits);
}

export { useSavedEntityTypeCounts };
