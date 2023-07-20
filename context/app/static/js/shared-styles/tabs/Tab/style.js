import styled from 'styled-components';
import Tab from '@material-ui/core/Tab';

const StyledTab = styled(Tab)`
  min-height: 45px;

  span {
    flex-direction: row;
  }

  svg {
    margin-bottom: 0 !important;
  }
`;

export { StyledTab };
