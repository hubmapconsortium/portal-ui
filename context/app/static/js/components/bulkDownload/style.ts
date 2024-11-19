import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  ...theme.typography.button,
  color: theme.palette.text.primary,
  fontSize: '1rem',
}));

export { StyledFormLabel };
