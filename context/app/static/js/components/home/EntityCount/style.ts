import { styled } from '@mui/material/styles';

const FlexLink = styled('a')(({ theme }) => ({
  display: 'flex',
  padding: '30px 20px 20px 20px',
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    svg: {
      color: theme.palette.getContrastText(theme.palette.primary.light),
    },
    '[role="img"]': {
      backgroundColor: theme.palette.getContrastText(theme.palette.primary.light),
    },
  },
}));

const StyledDiv = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(2),
  },
}));

export { FlexLink, StyledDiv };
