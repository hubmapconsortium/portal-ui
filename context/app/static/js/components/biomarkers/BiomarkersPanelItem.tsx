import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LineClamp from 'js/shared-styles/text/LineClamp';
import React from 'react';
import { InternalLink } from 'js/shared-styles/Links';
import Chip from '@mui/material/Chip';
import { borderRadius } from '@mui/system';

function StackTemplate(props: React.ComponentProps<typeof Stack>) {
  return <Stack direction="row" px={2} spacing={4} width="100%" height={52} {...props} />;
}

function HeaderCell({ children, ...props }: React.ComponentProps<typeof Typography>) {
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" {...props}>
      {children}
    </Typography>
  );
}

function BodyCell({ children, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box display="flex" alignItems="center" {...props}>
      {children}
    </Box>
  );
}

const rowConfig = {
  name: {
    flexBasis: '30%',
    flexGrow: 2,
  },
  description: {
    flexBasis: '40%',
    flexGrow: 2,
  },
  type: {
    flexBasis: 'fit-content',
    flexGrow: 1,
  },
};

function BiomarkerHeaderPanel() {
  return (
    <StackTemplate>
      <HeaderCell {...rowConfig.name}>Name</HeaderCell>
      <HeaderCell {...rowConfig.description}>Description</HeaderCell>
      <HeaderCell {...rowConfig.type}>Type</HeaderCell>
    </StackTemplate>
  );
}

interface BiomarkerPanelItemProps {
  name: string;
  href?: string;
  description: string;
  type: string;
}

function BiomarkerPanelItem({ name, href, description, type }: BiomarkerPanelItemProps) {
  return (
    <StackTemplate>
      <BodyCell {...rowConfig.name}>
        <InternalLink href={href}>{name}</InternalLink>
      </BodyCell>
      <BodyCell {...rowConfig.description}>
        <LineClamp lines={2}>{description}</LineClamp>
      </BodyCell>
      <BodyCell {...rowConfig.type}>
        <Chip
          variant="outlined"
          label={type}
          sx={(theme) => ({
            theme.spacing(1)
          })}
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
