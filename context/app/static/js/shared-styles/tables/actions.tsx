import React, { useCallback, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { useAppContext } from 'js/components/Contexts';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { useSnackbarActions } from '../snackbars';

export function Copy() {
  const [isLoading, setLoading] = useState(false);
  const handleCopyClick = useHandleCopyClick();
  const { selectedRows } = useSelectableTableStore();
  const { elasticsearchEndpoint, groupsToken } = useAppContext();
  const { toastError } = useSnackbarActions();

  const handleClick = useCallback(() => {
    async function fetchIDs() {
      const query = { query: getIDsQuery([...selectedRows]), _source: 'hubmap_id' };
      setLoading(true);
      const searchResults = (await fetchSearchData(query, elasticsearchEndpoint, groupsToken)) as SearchResponse<{
        hubmap_id: string;
      }>;
      return searchResults?.hits?.hits;
    }

    fetchIDs()
      .then((searchHits) => handleCopyClick(searchHits.map(({ _source }) => _source?.hubmap_id ?? '').join(', ')))
      .catch((e) => {
        toastError('Failed to copy to clipboard.');
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [handleCopyClick, toastError, selectedRows, elasticsearchEndpoint, groupsToken]);

  return (
    <WhiteBackgroundIconButton disabled={selectedRows.size === 0 || isLoading} onClick={handleClick}>
      <ContentCopyIcon />
    </WhiteBackgroundIconButton>
  );
}
