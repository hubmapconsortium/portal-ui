import React from 'react';

import LineClamp from 'js/shared-styles/text/LineClamp';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import Box from '@mui/material/Box';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';

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
}

function BiomarkerPanelItem({ name, href, description, geneName }: BiomarkerPanelItemProps) {
  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <InternalLink href={href}>{name}</InternalLink>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description">
        <LineClamp lines={2}>{description}</LineClamp>
      </BodyCell>
      <BodyCell {...desktopConfig.type} aria-label="Type">
        <ViewDatasetsButton
          scFindParams={{ genes: [geneName] }}
          trackingInfo={{
            category: 'Biomarker Landing Page',
            action: 'View Datasets',
            label: name,
          }}
          isLoading={false}
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
