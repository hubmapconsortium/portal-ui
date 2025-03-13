import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

const StyledContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: theme.spacing(0.2, 0.75),
  marginRight: theme.spacing(2),
  borderRadius: theme.spacing(2),
  color: theme.palette.common.white,
  backgroundColor: theme.palette.info.main,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  marginBottom: theme.spacing(0.1),
  marginLeft: theme.spacing(0.15),
}));

export { StyledContainer, StyledTypography };
