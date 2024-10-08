import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export { StyledFormLabel };
