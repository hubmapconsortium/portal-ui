import React from 'react';
import MUITabs, { TabsProps } from '@mui/material/Tabs';

function Tabs({ children, ...props }: TabsProps) {
  return (
    <MUITabs
      variant="fullWidth"
      TabIndicatorProps={{ sx: ({ spacing }) => ({ backgroundColor: 'action.activeTab', height: spacing(0.5) }) }}
      sx={{
        color: 'primaryContainer.contrastText',
        backgroundColor: 'primaryContainer.main',
        borderRadius: '4px 4px 0px 0px',
        flex: 'none',
      }}
      {...props}
    >
      {children}
    </MUITabs>
  );
}

export default Tabs;
