import React, { useCallback, useMemo } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { DownIcon } from 'js/shared-styles/icons';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';

import { useResultsList, useTrackBiomarkerLandingPage, useViewMore } from './hooks';
import BiomarkerPanel from './BiomarkersPanelItem';

function ViewMoreButton() {
  const { isLoading, isValidating, hasMore } = useResultsList();
  const viewMore = useViewMore();
  const { toastError } = useSnackbarActions();

  const track = useTrackBiomarkerLandingPage();

  const handleViewMore = useCallback(() => {
    track({
      action: 'Select Table "View More"',
      label: 'Biomarkers',
    });
    viewMore().catch((error: unknown) => {
      console.error(error);
      toastError('Failed to load more biomarkers.');
    });
  }, [toastError, viewMore, track]);

  return (
    <LoadingButton
      color="primary"
      variant="contained"
      fullWidth
      loading={isLoading || isValidating}
      onClick={handleViewMore}
      disabled={!hasMore}
      endIcon={<DownIcon />}
    >
      View More
    </LoadingButton>
  );
}

export default function BiomarkersPanelList() {
  const { genesList, isLoading } = useResultsList();

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!genesList.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <>No results found. Try searching for a different biomarker.</>,
          key: 'no-results',
        },
      ];
    }
    const propsList: PanelProps[] = [
      {
        key: 'header',
        noPadding: true,
        children: <BiomarkerPanel.Header />,
      },
      ...genesList.map(({ approved_name, approved_symbol, summary }) => ({
        key: approved_symbol,
        noPadding: true,
        noHover: false,
        children: (
          <BiomarkerPanel.Item
            name={`${approved_name} (${approved_symbol})`}
            description={summary || 'No description available.'}
            href={`/genes/${approved_symbol}`}
            geneName={approved_symbol}
          />
        ),
      })),
      {
        key: 'view-more',
        noPadding: true,
        children: <ViewMoreButton />,
      },
    ];
    return propsList;
  }, [genesList, isLoading]);

  return <PanelList panelsProps={panelsProps} />;
}
