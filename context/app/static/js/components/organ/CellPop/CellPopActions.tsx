import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { ExpandButton } from 'js/components/detailPage/visualization/Visualization/style';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import VisualizationThemeSwitch from 'js/components/detailPage/visualization/VisualizationThemeSwitch';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { trackEvent } from 'js/helpers/trackers';

interface CellPopActionsProps {
  id: string;
}

function visualizationSelector(store: VisualizationStore) {
  return store.expandViz;
}

export default function CellPopActions({ id }: CellPopActionsProps) {
  const expandViz = useVisualizationStore(visualizationSelector);
  const expand = useCallback(() => {
    trackEvent({ category: 'Organ Page', action: 'Expand Cell Population Plot' });
    expandViz(id);
  }, [expandViz, id]);
  return (
    <SpacedSectionButtonRow
      buttons={
        <Stack direction="row" spacing={1}>
          <VisualizationThemeSwitch />
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
