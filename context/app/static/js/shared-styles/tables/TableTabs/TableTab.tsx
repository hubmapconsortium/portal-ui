import React from 'react';
import { Tab, TabProps } from 'js/shared-styles/tabs';
import { styled } from '@mui/material/styles';

interface TableTabProps extends TabProps {
  isSingleTab?: boolean;
}

const SingleTableTab = styled((props: TabProps) => <Tab aria-disabled disableRipple {...props} />)({
  cursor: 'default',
});

function TableTab({ isSingleTab = false, ...props }: TableTabProps, ref: React.Ref<HTMLDivElement>) {
  const TabComponent = isSingleTab ? SingleTableTab : Tab;
  return <TabComponent {...props} ref={ref} />;
}

export default React.forwardRef(TableTab) as React.ForwardRefExoticComponent<
  TableTabProps & React.RefAttributes<HTMLDivElement>
>;
