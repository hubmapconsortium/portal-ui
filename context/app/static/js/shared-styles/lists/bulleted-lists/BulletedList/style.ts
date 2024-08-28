import { styled } from '@mui/material/styles';
import List from '@mui/material/List';

const StyledList = styled(List)(({ theme }) => ({
  listStyle: 'disc',
  paddingLeft: theme.spacing(2.5),
}));

export { StyledList };
