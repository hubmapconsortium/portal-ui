import React from 'react';

import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import LineClamp from 'js/shared-styles/text/LineClamp';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';

const desktopConfig = {
  name: {
    flexBasis: '30%',
    flexGrow: 1,
  },
  description: {
    flexBasis: '40%',
    flexGrow: 1,
  },
  type: {
    flexBasis: 'fit-content',
    flexShrink: 0,
    flexGrow: 1,
  },
};

function BiomarkerHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={1}>
      <HeaderCell {...desktopConfig.name}>Name</HeaderCell>
      <HeaderCell {...desktopConfig.description}>Description</HeaderCell>
      <HeaderCell {...desktopConfig.type}>Type</HeaderCell>
    </StackTemplate>
  );
}

interface BiomarkerPanelItemProps {
  name: string;
  href?: string;
  description: string;
  type: string;
}

const UnroundedChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '&.MuiChip-outlined': {
    borderRadius: theme.spacing(1),
  },
}));

function BiomarkerPanelItem({ name, href, description, type }: BiomarkerPanelItemProps) {
  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <InternalLink href={href}>{name}</InternalLink>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description">
        <LineClamp lines={2}>{description}</LineClamp>
      </BodyCell>
      <BodyCell {...desktopConfig.type} aria-label="Type">
        <UnroundedChip variant="outlined" label={type} />
      </BodyCell>
    </StackTemplate>
  );
}

const BiomarkerPanel = {
  Header: BiomarkerHeaderPanel,
  Item: BiomarkerPanelItem,
};

export default BiomarkerPanel;
