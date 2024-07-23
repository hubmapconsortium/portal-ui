import styled from 'styled-components';
import Container from '@mui/material/Container';

const FlexContainer = styled(Container)`
  display: flex;
  align-items: center;
  padding: 0px;
  & > svg {
    margin-left: 5px;
  }
  & > a {
    margin-left: 5px;
  }
`;

export { FlexContainer };
