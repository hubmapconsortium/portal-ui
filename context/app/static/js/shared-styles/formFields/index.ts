import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const PrimaryOutlinedTextField = styled(TextField)(({ theme }) => ({
  '&&': {
    'div &:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export { PrimaryOutlinedTextField };
