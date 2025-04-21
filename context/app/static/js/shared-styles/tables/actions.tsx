import React, { useCallback, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/material/styles';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { TooltipIconButton, TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';

import { useAppContext } from 'js/components/Contexts';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { DeleteIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';
import { EventInfo } from 'js/components/types';
import { useSnackbarActions } from '../snackbars';

const TableIconButton = styled(TooltipIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  color: theme.palette.primary.main,
  borderRadius: theme.spacing(1),
  svg: {
    fontSize: '1.25rem',
  },
  border: `1px solid ${theme.palette.divider}`,
}));

interface CopyProps {
  trackingInfo?: EventInfo;
}

export function Copy({ trackingInfo }: CopyProps) {
  const [isLoading, setLoading] = useState(false);
  const handleCopyClick = useHandleCopyClick();
  const { selectedRows } = useSelectableTableStore();
  const { elasticsearchEndpoint, groupsToken } = useAppContext();
  const { toastError } = useSnackbarActions();

  const handleClick = useCallback(() => {
    if (trackingInfo) {
      trackEvent({
        ...trackingInfo,
        action: 'Copy HuBMAP IDs',
      });
    }

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
  }, [trackingInfo, handleCopyClick, toastError, selectedRows, elasticsearchEndpoint, groupsToken]);

  return (
    <TableIconButton
      disabled={selectedRows.size === 0 || isLoading}
      onClick={handleClick}
      tooltip="Copy HuBMAP IDs to clipboard."
    >
      <ContentCopyIcon />
    </TableIconButton>
  );
}

type DeleteProps = Omit<TooltipButtonProps, 'tooltip'> & Partial<Pick<TooltipButtonProps, 'tooltip'>>;

export function Delete(props: DeleteProps) {
  return (
    <TableIconButton tooltip="Remove selected rows." {...props}>
      <DeleteIcon />
    </TableIconButton>
  );
}
