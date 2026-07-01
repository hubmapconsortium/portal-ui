import { styled } from '@mui/material/styles';

export const List = styled('ul')(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  paddingLeft: theme.spacing(3),
  ...theme.typography.body1,
  '> li': {
    listStyleType: 'disc',
    marginBottom: theme.spacing(0.25),
  },
}));
