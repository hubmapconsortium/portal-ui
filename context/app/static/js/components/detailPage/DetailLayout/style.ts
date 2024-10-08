import { styled } from '@mui/material/styles';
import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export { StyledAlert };
