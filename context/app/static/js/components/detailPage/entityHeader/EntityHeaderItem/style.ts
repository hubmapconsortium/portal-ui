import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

const VerticalDivider = styled(Divider)(({ theme }) => ({
  marginX: theme.spacing(2),
  height: '100%',
  alignSelf: 'center',
}));

export { VerticalDivider };
