import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const StyledContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  fontSize: '.75rem',
  padding: theme.spacing(0.2, 0.75),
  marginRight: theme.spacing(2),
  borderRadius: theme.spacing(2),
  color: theme.palette.common.white,
  backgroundColor: theme.palette.info.main,
}));

export { StyledContainer };
