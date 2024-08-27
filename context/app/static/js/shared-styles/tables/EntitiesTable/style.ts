import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')({
  height: '100%',
  width: '100%',
  overflowY: 'auto',
  minHeight: '0px', // flex overflow fix
  maxHeight: '340px', // Cuts off the last row partially to cue users to scroll.
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export { StyledDiv, StyledPaper };
