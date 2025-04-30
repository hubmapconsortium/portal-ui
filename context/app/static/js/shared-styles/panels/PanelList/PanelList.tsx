import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import Panel, { PanelProps } from 'js/shared-styles/panels/Panel';
import { PanelScrollBox } from './style';

interface PanelListProps {
  panelsProps: PanelProps[];
}

function PanelList({ panelsProps }: PanelListProps) {
  const headerProps = panelsProps.find((p) => 'key' in p && p.key === 'header');
  const itemProps = panelsProps.filter((p) => !('key' in p && p.key === 'header'));

  return (
    <Stack
      component={Paper}
      display="flex"
      flexDirection="column"
      sx={{
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      {headerProps && <Panel {...headerProps} />}
      <PanelScrollBox>
        {itemProps.map((props) => (
          <Panel key={'key' in props ? props.key : props.title} {...props} />
        ))}
      </PanelScrollBox>
    </Stack>
  );
}

export default PanelList;
