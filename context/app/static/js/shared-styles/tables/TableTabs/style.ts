import { styled } from '@mui/material/styles';
import { TabPanel } from 'js/shared-styles/tabs';

const StyledTabPanel = styled(TabPanel)((props) => ({
  minHeight: '0px', // flex overflow fix
  display: 'flex',
  flexGrow: props.value === props.index ? 1 : 0,
  // A row flex container sizes its children to their content; stretch them to the panel's width instead.
  '& > *': {
    flexGrow: 1,
  },
}));

export { StyledTabPanel };
