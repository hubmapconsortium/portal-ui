import { styled } from '@mui/material/styles';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';

const StyledTabPanel = styled(TabPanel)(({ index, value }) => ({
  display: value === index ? 'flex' : 'none',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  minHeight: 0,
  width: '100%',
}));

const StyledTabs = styled(Tabs)({
  flex: 'none',
});

export { StyledTabPanel, StyledTabs };
