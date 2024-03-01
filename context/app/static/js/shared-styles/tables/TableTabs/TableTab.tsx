import React from 'react';
import { Tab, TabProps } from 'js/shared-styles/tabs';
import { styled } from '@mui/material/styles';

interface TableTabProps extends TabProps {
  isSingleTab?: boolean;
}

const SingleTableTab = styled((props: TabProps) => <Tab aria-disabled disableRipple {...props} />)({
  cursor: 'default',
});

export default function TableTab({ isSingleTab = false, ...props }: TableTabProps) {
  const TabComponent = isSingleTab ? SingleTableTab : Tab;
  return <TabComponent {...props} />;
}
