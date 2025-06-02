import { styled } from '@mui/material/styles';
import Description from 'js/shared-styles/sections/Description';

const PageWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StyledDescription = styled(Description)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export { PageWrapper, StyledDescription };
