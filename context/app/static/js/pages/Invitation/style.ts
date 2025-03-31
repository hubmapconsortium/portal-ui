import styled from '@mui/material/styles/styled';
import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(5),
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
}));

export { StyledAlert };
