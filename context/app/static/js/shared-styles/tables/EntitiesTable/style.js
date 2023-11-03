import styled from 'styled-components';
import { TabPanel } from 'js/shared-styles/tabs';

const StyledDiv = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  min-height: 0px; // flex overflow fix
  max-height: 340px; // Cuts off the last row partially to cue users to scroll.
`;

const StyledTabPanel = styled(TabPanel)`
  ${(props) => props.value === props.index && `flex-grow: 1`};
  display: flex;
  min-height: 0px; // flex overflow fix
`;

export { StyledDiv, StyledTabPanel };
