import React from 'react';
import { PaddedBox } from './style';

function TabPanel({ children, value, index, pad, ...props }) {
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
