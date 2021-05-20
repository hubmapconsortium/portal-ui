import styled from 'styled-components';
import TabPanel from 'js/shared-styles/tabs/TabPanel';
import { Alert } from 'js/shared-styles/alerts';

const StyledTabPanel = styled(TabPanel)`
  flex: 1;
`;

const StyledAlert = styled(Alert)`
  align-self: center;
  flex-grow: 1;
  margin: 10px;
`;

export { StyledTabPanel, StyledAlert };
