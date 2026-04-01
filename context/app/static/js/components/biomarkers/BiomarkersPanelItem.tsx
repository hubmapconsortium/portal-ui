import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LineClamp from 'js/shared-styles/text/LineClamp';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import Box from '@mui/material/Box';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';
import ViewDatasetsDropdownButton from './ViewDatasetsDropdownButton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

const desktopConfig = {
  name: {
    flexBasis: '25%',
    flexGrow: 1,
    flexShrink: 0,
  },
  description: {
    flexBasis: '45%',
    flexGrow: 1,
  },
  type: {
    flexBasis: 'fit-content',
    flexShrink: 0,
    flexGrow: 0,
    pr: 2,
  },
};

function ModalityChip({ label, color }: { label: string; color: 'primary' | 'secondary' }) {
  return (
    <SecondaryBackgroundTooltip title={`This gene is available in ${label} datasets indexed by scFind`}>
      <span>
        <Chip label={label} size="small" color={color} variant="outlined" />
      </span>
    </SecondaryBackgroundTooltip>
  );
}

function BiomarkerHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={1}>
      <HeaderCell {...desktopConfig.name}>Name</HeaderCell>
      <HeaderCell {...desktopConfig.description}>Description</HeaderCell>
      <HeaderCell {...desktopConfig.type}>
        Datasets
        <Box visibility="hidden" height={0}>
          <ViewDatasetsButton scFindParams={{}} isLoading={false} />
        </Box>
      </HeaderCell>
    </StackTemplate>
  );
}

interface BiomarkerPanelItemProps {
  name: string;
  href?: string;
  description: string;
  geneName: string;
  hasScfindRna?: boolean | null;
  hasScfindAtac?: boolean | null;
}

function BiomarkerPanelItem({
  name,
  href,
  description,
  geneName,
  hasScfindRna,
  hasScfindAtac,
}: BiomarkerPanelItemProps) {
  const hasChips = hasScfindRna || hasScfindAtac;
  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <Box>
          <InternalLink href={href}>{name}</InternalLink>
          {hasChips && (
            <Stack direction="row" spacing={0.5} mt={0.5}>
              {hasScfindRna && <ModalityChip label="RNA" color="primary" />}
              {hasScfindAtac && <ModalityChip label="ATAC" color="secondary" />}
            </Stack>
          )}
        </Box>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description">
        <LineClamp lines={2}>{description}</LineClamp>
      </BodyCell>
      <BodyCell {...desktopConfig.type} aria-label="Type">
        <ViewDatasetsDropdownButton
          geneName={geneName}
          hasScfindRna={hasScfindRna}
          hasScfindAtac={hasScfindAtac}
          trackingInfo={{
            category: 'Biomarker Landing Page',
            action: 'View Datasets',
            label: name,
          }}
        />
      </BodyCell>
    </StackTemplate>
  );
}

const BiomarkerPanel = {
  Header: BiomarkerHeaderPanel,
  Item: BiomarkerPanelItem,
};

export default BiomarkerPanel;
