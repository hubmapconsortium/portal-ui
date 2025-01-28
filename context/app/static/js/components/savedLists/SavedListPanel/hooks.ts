import useSavedEntityData from 'js/hooks/useSavedEntityData';
import { SavedEntity } from 'js/components/savedLists/types';
import { getSearchHitsEntityCounts } from 'js/helpers/functions';

const source = ['entity_type']; // 'memoize' to prevent infinite loop

function useSavedEntityTypeCounts(listSavedEntities: Record<string, SavedEntity>) {
  const { searchHits } = useSavedEntityData(listSavedEntities, source);
  const counts = getSearchHitsEntityCounts(searchHits);

  return {
    donors: counts.Donor || 0,
    samples: counts.Sample || 0,
    datasets: counts.Dataset || 0,
  };
}

export { useSavedEntityTypeCounts };
