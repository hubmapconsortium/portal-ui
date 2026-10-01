import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme }) => ({
  // Targets the input wrapper by class rather than `> :first-child`: the first child is the
  // label whenever one is supplied, and `:first-of-type` would match both it and the wrapper.
  '& > .MuiInputBase-root': {
    borderRadius: theme.spacing(0.5),
  },
  backgroundColor: theme.palette.background.paper,
}));

export { StyledTextField };
