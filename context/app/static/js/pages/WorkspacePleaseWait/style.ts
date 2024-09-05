import { styled } from '@mui/material/styles';
import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FlexColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  flexGrow: 1,
});

const CenteredFlexItem = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export { StyledAlert, FlexColumn, CenteredFlexItem };
