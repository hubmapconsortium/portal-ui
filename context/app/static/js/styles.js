import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  MuiAppBar: {
    marginBottom: "16px",
  },
  root: {
    flexGrow: 1,
  },
  tabsRoot: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  title: {
    flexGrow: 1,
  },
  hubmaptypeLight: {
    marginRight: "10px",
    fill: "#FFF",
    height: "20px"
  },
  hubmaptypeDark: {
    marginLeft: "5px",
    fill: theme.palette.primary.light,
    strokeWidth: "1px",
    height: "40px"
  }
}));