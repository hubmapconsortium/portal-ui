import { makeStyles } from '@material-ui/core/styles';

const useRoundedSecondaryTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0.4rem',
  },
}));

export { useRoundedSecondaryTooltipStyles };
