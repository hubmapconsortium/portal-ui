import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

export { StyledTextField };
