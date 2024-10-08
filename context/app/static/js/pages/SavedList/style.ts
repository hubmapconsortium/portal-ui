import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const SpacingDiv = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const PageSpacing = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

const StyledHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export { SpacingDiv, PageSpacing, StyledHeader };
