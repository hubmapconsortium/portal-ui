import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export const StyledHeaderButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  '.MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
    color: theme.palette.common.white,
  },
}));

export const StyledHeaderIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));
