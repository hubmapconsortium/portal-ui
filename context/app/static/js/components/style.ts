import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)(({ theme }) => ({
  width: theme.breakpoints.values.lg,
  marginTop: theme.spacing(3),
  zIndex: 0, // Does not display on preview pages without this; Not sure sure why not.
  display: 'flex',
  alignItems: 'center',
}));

const FlexContainer = styled(Container)({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
});

const StyledLaunchButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1, 3),
}));

export { StyledAlert, FlexContainer, StyledLaunchButton };
