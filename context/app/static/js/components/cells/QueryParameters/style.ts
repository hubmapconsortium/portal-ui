import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledDiv = styled(Grid)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1.5, 0),
}));

export { StyledDiv, StyledTextField };
