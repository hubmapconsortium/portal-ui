import { Tabs, Tab } from 'js/shared-styles/tabs';
import { styled } from '@mui/material/styles';

const StyledTab = styled(Tabs)(({ theme }) => ({
  '&.MuiTabs-root': {
    backgroundColor: theme.palette.accent.success90,
  },
}));

export { StyledTab as Tabs, Tab };
