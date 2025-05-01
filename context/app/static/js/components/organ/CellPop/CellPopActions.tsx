import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { ExpandButton } from 'js/components/detailPage/visualization/Visualization/style';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import VisualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useOrganContext } from 'js/components/organ/contexts';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface CellPopActionsProps {
  id: string;
}

function visualizationSelector(store: VisualizationStore) {
  return store.expandViz;
}

export default function CellPopActions({ id }: CellPopActionsProps) {
  const {
    organ: { name },
  } = useOrganContext();
  const trackEntityPageEvent = useTrackEntityPageEvent('Organ Page');

  const expandViz = useVisualizationStore(visualizationSelector);
  const expand = useCallback(() => {
    trackEntityPageEvent({ action: 'Expand Cell Population Plot', label: name });
    expandViz(id);
  }, [expandViz, id, name, trackEntityPageEvent]);
  return (
    <SpacedSectionButtonRow
      buttons={
        <Stack direction="row" spacing={1}>
          <VisualizationThemeSwitch trackingInfo={{ category: 'Organ Page', action: 'Cellpop', label: name }} />
          <SecondaryBackgroundTooltip title="Switch to Fullscreen">
            <ExpandButton size="small" onClick={expand} variant="contained">
              <FullscreenRoundedIcon color="primary" />
            </ExpandButton>
          </SecondaryBackgroundTooltip>
        </Stack>
      }
    />
  );
}
