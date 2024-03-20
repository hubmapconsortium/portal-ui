import React from 'react';
import MUITab, { TabProps as MUITabProps } from '@mui/material/Tab';

interface TabProps extends MUITabProps {
  index: number;
}

function Tab({ index, ...props }: TabProps, ref: React.Ref<HTMLDivElement>) {
  return <MUITab id={`tab-${index}`} aria-controls={`tabpanel-${index}`} {...props} ref={ref} />;
}

export default React.forwardRef(Tab);
export type { TabProps };
