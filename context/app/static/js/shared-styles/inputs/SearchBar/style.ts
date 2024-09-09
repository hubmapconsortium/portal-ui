import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& > :first-child': {
    borderRadius: theme.spacing(0.5),
  },
}));

export { StyledTextField };
