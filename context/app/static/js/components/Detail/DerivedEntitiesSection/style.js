import styled from 'styled-components';
import TabPanel from 'js/shared-styles/tabs/TabPanel';

const StyledDiv = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const StyledTabPanel = styled(TabPanel)`
  flex-grow: 1;
`;

export { StyledDiv, StyledTabPanel };
