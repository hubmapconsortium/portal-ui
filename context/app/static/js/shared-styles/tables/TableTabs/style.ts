import { styled } from '@mui/material/styles';
import { TabPanel } from 'js/shared-styles/tabs';

const StyledTabPanel = styled(TabPanel)((props) => ({
  minHeight: '0px', // flex overflow fix
  display: 'flex',
  flexGrow: props.value === props.index ? 1 : 0,
}));

export { StyledTabPanel };
