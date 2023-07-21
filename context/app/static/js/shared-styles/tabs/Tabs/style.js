import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';

const StyledTabs = styled(Tabs)`
  box-shadow: '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)';
  background-color: ${(props) => props.theme.palette.primary.main};
  color: ${(props) => props.theme.palette.white.main};
`;

export { StyledTabs };
