import { styled } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'list-item',
  listStyle: 'disc',
  padding: theme.spacing(0, 1.5),
}));

export { StyledListItem };
