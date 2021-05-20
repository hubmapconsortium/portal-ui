import styled from 'styled-components';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';
import { Alert } from 'js/shared-styles/alerts';

const StyledTabPanel = styled(TabPanel)`
  flex: 1;
  min-height: 0px; // flex overflow fix
`;

const StyledTabs = styled(Tabs)`
  flex: none;
`;

const StyledAlert = styled(Alert)`
  align-self: center;
  flex-grow: 1;
  margin: 10px;
`;

export { StyledTabPanel, StyledTabs, StyledAlert };
