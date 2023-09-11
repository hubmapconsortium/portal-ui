import { Box } from '@mui/material';
import React from 'react';

function URLSvgIcon({ iconURL, ariaLabel, ...rest }) {
  return (
    <Box
      sx={(theme) => ({
        maskImage: `url(${iconURL})`,
        backgroundColor: theme.palette.primary.main,
        maskRepeat: 'no-repeat',
        width: theme.spacing(3),
        height: theme.spacing(3),
      })}
      iconURL={iconURL}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    />
  );
}

export default URLSvgIcon;
