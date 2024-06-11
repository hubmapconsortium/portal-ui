import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroGridContainer = styled(Box)(({ theme }) => ({
  // On mobile, the grid is a single column containing all the tab panels and tabs
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
  },
  // On desktop, the grid has a container for the tab panels and a container for the tabs
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateAreas: `
      'panel panel panel panel'
      'tab1 tab2 tab3 tab4'
    `,
    '& > *': {
      borderRight: `1px solid ${theme.palette.grey[200]}`,
      '&:last-child': {
        borderRight: '0px solid transparent',
      },
    },
  },
}));

const HeroTabContainer = styled(Box)(({ theme }) => ({
  
});
