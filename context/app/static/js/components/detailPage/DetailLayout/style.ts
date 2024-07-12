import { styled } from '@mui/material/styles';
import { Alert } from 'js/shared-styles/alerts';

const Content = styled('div')({
  width: 'calc(100% - 150px)',
});

const FlexRow = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(5),
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export { Content, FlexRow, StyledAlert };
