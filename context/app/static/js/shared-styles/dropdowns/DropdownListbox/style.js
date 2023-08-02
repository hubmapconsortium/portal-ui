import styled from 'styled-components';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

const StyledPopper = styled(Popper)`
  z-index: ${(props) => props.theme.zIndex.dropdown};
`;

const StyledPaper = styled(Paper)`
  max-height: 250px;
  overflow-y: auto;
`;

export { StyledPopper, StyledPaper };
