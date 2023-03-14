import styled from 'styled-components';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';

const StyledTabPanel = styled(TabPanel)`
  ${(props) => props.value === props.index && `flex-grow: 1`};
  display: flex;
  min-height: 0px; // flex overflow fix
`;

const StyledTabs = styled(Tabs)`
  flex: none;
`;

export { StyledTabPanel, StyledTabs };
