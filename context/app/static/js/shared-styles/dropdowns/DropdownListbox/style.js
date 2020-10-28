import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

const StyledPopper = styled(Popper)`
  z-index: 50;
`;

const StyledPaper = styled(Paper)`
  max-height: 250px;
  overflow-y: auto;
`;

export { StyledPopper, StyledPaper };
