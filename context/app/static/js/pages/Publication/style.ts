import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5, 5, 2.5, 5),
  marginBottom: theme.spacing(2),
  h2: {
    padding: theme.spacing(2.5, 0),
  },
}));

export { StyledPaper };
