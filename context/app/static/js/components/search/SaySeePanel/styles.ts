import { styled } from '@mui/material/styles';

export const List = styled('ul')(({ theme }) => ({
  margin: theme.spacing(1, 0),
  paddingLeft: theme.spacing(3),
  '> li': {
    marginBottom: theme.spacing(1),
    listStyleType: 'disc',
  },
}));
