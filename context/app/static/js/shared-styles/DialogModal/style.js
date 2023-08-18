import { styled } from '@mui/styles';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2, 3, 0, 2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '1.5px',
  mt: theme.spacing(1),
}));

export { StyledDivider, StyledDialogTitle };
