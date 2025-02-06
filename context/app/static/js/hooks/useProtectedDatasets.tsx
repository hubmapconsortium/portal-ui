import { useCallback, useRef } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Dataset } from 'js/components/types';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';

export type DatasetAccessLevelHits = SearchHit<Pick<Dataset, 'hubmap_id' | 'mapped_dataset_access_level' | 'uuid'>>[];

function useDatasetsAccessLevel(ids: string[]) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids)],
        must_not: [getTermClause('mapped_data_access_level.keyword', 'Public')],
      },
    },
    _source: ['mapped_data_access_level', 'hubmap_id', 'uuid'],
    size: ids.length,
  };
  const { searchHits: datasets } = useSearchHits(query) as { searchHits: DatasetAccessLevelHits };
  return { datasets };
}

interface useProtectedDatasetsFormProps {
  selectedRows: Set<string>;
  deselectRows: (uuids: string[]) => void;
  protectedDatasetsErrorMessage: (protectedRows: DatasetAccessLevelHits) => string;
  trackEventHelper: (numProtectedDatasets: number) => void;
}
function useProtectedDatasetsForm({
  selectedRows,
  deselectRows,
  protectedDatasetsErrorMessage,
  trackEventHelper,
}: useProtectedDatasetsFormProps) {
  const { toastSuccessRemoveProtectedDatasets } = useWorkspaceToasts();
  const protectedRows = useDatasetsAccessLevel(selectedRows.size > 0 ? [...selectedRows] : []).datasets;

  const containsProtectedDataset = protectedRows.length > 0;

  const reportedProtectedRows = useRef(false);

  const errorMessages = [];

  if (containsProtectedDataset) {
    errorMessages.push(protectedDatasetsErrorMessage(protectedRows));
    if (!reportedProtectedRows.current) {
      reportedProtectedRows.current = true;
      trackEventHelper(protectedRows.length);
    }
  }
  const protectedHubmapIds = protectedRows?.map((row) => row?._source?.hubmap_id).join(', ');

  const removeProtectedDatasets = useCallback(() => {
    deselectRows(protectedRows.map((r) => r._id));
    toastSuccessRemoveProtectedDatasets();
  }, [deselectRows, protectedRows, toastSuccessRemoveProtectedDatasets]);

  return { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows };
}

export { useProtectedDatasetsForm };
