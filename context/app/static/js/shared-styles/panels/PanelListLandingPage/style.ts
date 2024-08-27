import { styled } from '@mui/material/styles';

import Description from 'js/shared-styles/sections/Description';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const PageWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    height: `calc(100vh - ${headerHeight + 24}px)`,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StyledDescription = styled(Description)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export { PageWrapper, StyledDescription };
