import { styled } from '@mui/material/styles';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';

const StyledTabPanel = styled(TabPanel)(({ index, value }) => ({
  flexGrow: value === index ? 1 : 0,
  display: 'flex',
  minHeight: 0, // flex overflow fix
}));

const StyledTabs = styled(Tabs)({
  flex: 'none',
});

export { StyledTabPanel, StyledTabs };
