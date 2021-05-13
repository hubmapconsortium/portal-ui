import styled from 'styled-components';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../TabPanel';

const StyledTabPanel = styled(TabPanel)`
  width: 100%;
`;

const StyledTab = styled(Tab)`
  min-height: 72px;
`;

export { StyledTabPanel, StyledTab };
