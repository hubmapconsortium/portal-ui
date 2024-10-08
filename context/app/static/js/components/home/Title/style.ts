import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(4),
  },
}));

export { StyledDiv };
