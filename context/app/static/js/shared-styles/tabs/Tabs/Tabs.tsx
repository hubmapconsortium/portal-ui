import React from 'react';
import MUITabs, { TabsProps } from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';

const Tabs = styled((props: TabsProps) => <MUITabs variant="fullWidth" {...props} />)(
  ({
    theme: {
      palette: { primaryContainer, action },
      spacing,
    },
  }) => ({
    color: primaryContainer.contrastText,
    backgroundColor: primaryContainer.main,
    borderRadius: spacing(0.5, 0.5, 0, 0),
    flex: 'none',
    '& .MuiTabs-indicator': {
      backgroundColor: action.activeTab,
      height: spacing(0.5),
    },

    '& .MuiTab-root': {
      color: primaryContainer.secondaryContrastText,
    },

    '& .MuiTab-root.Mui-selected': {
      color: primaryContainer.contrastText,
    },
  }),
);
export default Tabs;
