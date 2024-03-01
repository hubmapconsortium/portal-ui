import React from 'react';
import MUITab, { TabProps as MUITabProps } from '@mui/material/Tab';

interface TabProps extends MUITabProps {
  index: number;
}

function Tab({ index, ...props }: TabProps) {
  return <MUITab id={`tab-${index}`} aria-controls={`tabpanel-${index}`} {...props} />;
}

export default Tab;
export type { TabProps };
