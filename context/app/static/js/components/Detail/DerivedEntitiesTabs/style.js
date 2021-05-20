import styled from 'styled-components';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';
import { Alert } from 'js/shared-styles/alerts';

const StyledTabPanel = styled(TabPanel)`
  ${(props) => props.value === props.index && `flex-grow: 1`};
  display: flex;
  min-height: 0px; // flex overflow fix
  align-items: center;
`;

const StyledTabs = styled(Tabs)`
  flex: none;
`;

const StyledAlert = styled(Alert)`
  margin: 10px;
  flex-grow: 1;
`;

export { StyledTabPanel, StyledTabs, StyledAlert };
