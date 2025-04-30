import React from 'react';
import { format } from 'date-fns/format';

import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';

const desktopConfig = {
  name: {
    flexBasis: '75%',
    flexGrow: 1,
  },
  numDatasets: {
    flexBasis: '15%',
    flexGrow: 1,
  },
  creationDate: {
    flexBasis: 'fit-content',
    flexShrink: 0,
    flexGrow: 1,
  },
};

function CollectionHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  return (
    <StackTemplate spacing={1} position="sticky" top={0} zIndex={1}>
      <HeaderCell {...desktopConfig.name}>Name</HeaderCell>
      <HeaderCell {...desktopConfig.numDatasets}># of Datasets</HeaderCell>
      <HeaderCell {...desktopConfig.creationDate} marginRight={isMobile ? 0 : 3}>
        Creation Date
      </HeaderCell>
    </StackTemplate>
  );
}

interface CollectionPanelItemProps {
  name: string;
  hubmapId: string;
  numDatasets: number;
  creationDate: number;
  href?: string;
}

function CollectionPanelItem({ name, hubmapId, numDatasets, creationDate, href }: CollectionPanelItemProps) {
  const isMobile = useIsMobile();

  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <Typography>
          <InternalLink href={href}>{name}</InternalLink>
          {` (${hubmapId})`}
        </Typography>
      </BodyCell>
      <BodyCell
        {...desktopConfig.numDatasets}
        aria-label="Number of Datasets"
        justifyContent={isMobile ? 'inherit' : 'center'}
      >
        <Typography>{numDatasets}</Typography>
      </BodyCell>
      <BodyCell {...desktopConfig.creationDate} aria-label="Creation Date">
        <Typography>{format(new Date(creationDate), 'yyyy-MM-dd')}</Typography>
      </BodyCell>
    </StackTemplate>
  );
}

const CollectionPanel = {
  Header: CollectionHeaderPanel,
  Item: CollectionPanelItem,
};

export default CollectionPanel;
