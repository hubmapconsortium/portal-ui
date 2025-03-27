import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { Alert } from 'js/shared-styles/alerts';

const CenteredAlert = styled(Alert)({
  display: 'flex',
  alignItems: 'center',
});

const StyledAlert = styled(CenteredAlert)(({ theme }) => ({
  width: theme.breakpoints.values.lg,
  marginTop: theme.spacing(3),
  zIndex: 0, // Does not display on preview pages without this; Not sure sure why not.
}));

const FlexContainer = styled(Container)({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
});

export { CenteredAlert, StyledAlert, FlexContainer };
