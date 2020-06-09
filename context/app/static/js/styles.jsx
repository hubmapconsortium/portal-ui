import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hubmaptypeDark: {
    marginLeft: '5px',
    fill: theme.palette.primary.light,
    strokeWidth: '1px',
    height: '40px',
  },
}));
