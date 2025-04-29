import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';

import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { format } from 'date-fns/format';

const mobileStackProps: Partial<StackProps> = {
  height: 'unset',
  direction: 'column',
  spacing: 2,
  py: 2,
};

const desktopStackProps: Partial<StackProps> = {
  height: 52,
  direction: 'row',
  spacing: 4,
  py: 0,
};

function StackTemplate(props: React.ComponentProps<typeof Stack>) {
  const isMobile = useIsMobile();
  const responsiveProps = isMobile ? mobileStackProps : desktopStackProps;
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
    <StackTemplate spacing={1}>
      <HeaderCell {...desktopConfig.name}>Name</HeaderCell>
      <HeaderCell {...desktopConfig.numDatasets}># of Datasets</HeaderCell>
      <HeaderCell {...desktopConfig.creationDate}>Creation Date</HeaderCell>
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
  return (
    <StackTemplate>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <Typography>
          <InternalLink href={href}>{name}</InternalLink>
          {` (${hubmapId})`}
        </Typography>
      </BodyCell>
      <BodyCell {...desktopConfig.numDatasets} aria-label="Number of Datasets">
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
