import styled from 'styled-components';
import Tab from '@mui/material/Tab';

const StyledTab = styled(Tab)`
  min-height: 45px;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
    min-width: 160px;
  }
`;

export { StyledTab };
