import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import Panel, { PanelProps } from 'js/shared-styles/panels/Panel';
import { PanelScrollBox, PanelHeaderBox } from './style';

interface PanelListProps {
  panelsProps: PanelProps[];
}

function PanelList({ panelsProps }: PanelListProps) {
  const headerProps = panelsProps.find((p) => 'panelKey' in p && p.panelKey === 'header');
  const itemProps = panelsProps.filter((p) => !('panelKey' in p && p.panelKey === 'header'));

  return (
    <Stack
      component={Paper}
      flexDirection="column"
      sx={{
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      {headerProps && (
        <PanelHeaderBox>
          <Panel {...headerProps} />
        </PanelHeaderBox>
      )}
      <PanelScrollBox>
        {itemProps.map((props) => (
          // React's reserved `key` must be passed directly, not via spread.
          <Panel key={'panelKey' in props ? props.panelKey : props.title} {...props} />
        ))}
      </PanelScrollBox>
    </Stack>
  );
}

export default PanelList;
