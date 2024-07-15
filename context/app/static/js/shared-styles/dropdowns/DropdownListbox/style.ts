import { styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.dropdown,
}));

const StyledPaper = styled(Paper)({
  maxHeight: 250,
  overflowY: 'auto',
});

export { StyledPopper, StyledPaper };
