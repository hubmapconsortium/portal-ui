import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const StyledContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: theme.spacing(0.2, 0.75),
  marginRight: theme.spacing(2),
  borderRadius: theme.spacing(2),
  color: theme.palette.common.white,
  backgroundColor: theme.palette.warning.main,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: theme.typography.button.fontWeight,
  marginBottom: theme.spacing(0.3),
  marginRight: theme.spacing(0.25),
  marginLeft: theme.spacing(0.15),
}));

export { StyledContainer, StyledTypography };
