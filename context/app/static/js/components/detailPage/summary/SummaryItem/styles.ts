import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

export const VerticalDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  height: 15,
  backgroundColor: theme.palette.text.primary,
  alignSelf: 'center',
}));

export const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  marginRight: theme.spacing(1),
}));
