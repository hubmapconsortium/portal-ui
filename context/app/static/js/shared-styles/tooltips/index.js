import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

function TooltipBase({ classes, children, ...rest }) {
  return (
    <Tooltip {...rest} classes={classes} arrow>
      {children}
    </Tooltip>
  );
}

const useRoundedSecondaryBackgroundTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0.4rem',
  },
}));

function SecondaryBackgroundTooltip(props) {
  const secondaryClasses = useRoundedSecondaryBackgroundTooltipStyles();

  return <TooltipBase {...props} classes={secondaryClasses} />;
}

export { SecondaryBackgroundTooltip };
