import React, { ComponentProps } from 'react';
import { PaddedBox } from './style';

interface TabPanelProps extends ComponentProps<typeof PaddedBox> {
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
