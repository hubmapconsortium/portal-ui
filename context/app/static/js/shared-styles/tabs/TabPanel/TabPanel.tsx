import React, { PropsWithChildren } from 'react';
import { PaddedBox } from './style';

interface TabPanelProps extends PropsWithChildren {
  value: number;
  index: number;
  pad?: boolean;
}

function TabPanel({ children, value, index, pad, ...props }: TabPanelProps) {
  return (
    <PaddedBox
      $pad={pad}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && children}
    </PaddedBox>
  );
}

export default TabPanel;
