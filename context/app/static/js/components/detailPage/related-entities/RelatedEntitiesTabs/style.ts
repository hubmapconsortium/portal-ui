import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

import { TabPanel, Tabs } from 'js/shared-styles/tabs';
import { Alert } from 'js/shared-styles/alerts';
import { ComponentProps } from 'react';

const StyledTabPanel = styled(TabPanel)(({ index, value }: ComponentProps<typeof TabPanel>) => ({
  flexGrow: value === index ? 1 : 0,
  display: 'flex',
  minHeight: 0, // flex overflow fix
  alignItems: 'center',
}));

const StyledTabs = styled(Tabs)({
  flex: 0,
});

const StyledAlert = styled(Alert)({
  margin: 10,
  flexGrow: 1,
});

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '1.25rem',
  marginRight: theme.spacing(1),
}));

export { StyledTabPanel, StyledTabs, StyledAlert, StyledSvgIcon };
