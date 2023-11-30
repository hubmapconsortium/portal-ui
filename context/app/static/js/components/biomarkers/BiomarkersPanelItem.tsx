import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

import LineClamp from 'js/shared-styles/text/LineClamp';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useBiomarkersSearchActions, useBiomarkersSearchState } from './BiomarkersSearchContext';

function StackTemplate(props: React.ComponentProps<typeof Stack>) {
  const isMobile = useIsMobile();
  const responsiveProps: Partial<StackProps> = {
    height: isMobile ? 'unset' : 52,
    direction: isMobile ? 'column' : 'row',
    spacing: isMobile ? 2 : 4,
    py: isMobile ? 2 : 0,
  };
  return <Stack px={2} useFlexGap width="100%" {...responsiveProps} {...props} />;
}

function MobileLabel({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return null;
  }
  return (
    <Typography component="label" width="33%" flexShrink={0} pr={2}>
      {children}
    </Typography>
  );
}

function BodyCell({ children, ...props }: React.ComponentProps<typeof Box>) {
  const ariaLabel = props['aria-label'];
  return (
    <Box display="flex" alignItems="center" {...props}>
      <MobileLabel>{ariaLabel}</MobileLabel>
      {children}
    </Box>
  );
}

function HeaderCell({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <BodyCell {...props}>
      <Typography variant="subtitle2">{children}</Typography>
    </BodyCell>
  );
}

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

const UnroundedFilterChip = styled(SelectableChip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  '&.MuiChip-outlined': {
    borderRadius: theme.spacing(1),
  },
}));

function BiomarkerPanelFilters() {
  const { toggleFilterByGenes, toggleFilterByProteins } = useBiomarkersSearchActions();
  const { filterType } = useBiomarkersSearchState();
  return (
    <Stack direction="row" spacing={1}>
      <UnroundedFilterChip label="Filter by Genes" isSelected={filterType === 'gene'} onClick={toggleFilterByGenes} />
      <SecondaryBackgroundTooltip title="Coming soon">
        <span>
          <UnroundedFilterChip
            label="Filter by Proteins"
            isSelected={filterType === 'protein'}
            onClick={toggleFilterByProteins}
            disabled
          />
        </span>
      </SecondaryBackgroundTooltip>
    </Stack>
  );
}

const BiomarkerPanel = {
  Header: BiomarkerHeaderPanel,
  Item: BiomarkerPanelItem,
  Filters: BiomarkerPanelFilters,
};

export default BiomarkerPanel;
