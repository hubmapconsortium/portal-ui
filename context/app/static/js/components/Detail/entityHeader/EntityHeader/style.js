import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

const StyledPaper = styled(Paper)`
  position: sticky;
  top: 64px;
  z-index: 1000;
`;

const FlexContainer = styled(Container)`
  display: flex;
  height: 100%;
  align-items: center;
`;

export { StyledPaper, FlexContainer };
