/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

function TooltipBase(props) {
  const { classes, children, ...rest } = props;
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

const SecondaryBackgroundTooltip = (props) => {
  const secondaryClasses = useRoundedSecondaryBackgroundTooltipStyles();

  return <TooltipBase {...props} classes={secondaryClasses} />;
};

export { SecondaryBackgroundTooltip };
