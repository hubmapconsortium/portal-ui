import styled from 'styled-components';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TabPanel from '../TabPanel';

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
`;

const StyledTab = styled(Tab)`
  min-height: 72px;
`;

const StyledTabs = styled(Tabs)`
  box-shadow: '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)';
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
`;

export { StyledTabPanel, StyledTab, StyledTabs };
