import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

const SpacingDiv = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const PageSpacing = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export { StyledAlert, SpacingDiv, StyledHeader, PageSpacing };
