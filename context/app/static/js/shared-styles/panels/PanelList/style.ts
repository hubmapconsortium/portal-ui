import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const PanelScrollBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
}));

export { PanelScrollBox };
