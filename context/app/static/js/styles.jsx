import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  MuiAppBar: {
    marginBottom: '16px',
  },
  root: {
    flexGrow: 1,
  },
  // tab classes extends beyond the portal-ui style guide. Pulled from materials-ui example.
  tabs: {
    boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)',
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    flexGrow: 1,
  },
  hubmaptypeLight: {
    marginRight: '10px',
    fill: '#FFF',
    height: '20px',
  },
  hubmaptypeDark: {
    marginLeft: '5px',
    fill: theme.palette.primary.light,
    strokeWidth: '1px',
    height: '40px',
  },
  tabPanels: {
    width: '100%',
  },
  tabPanelBoxes: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
