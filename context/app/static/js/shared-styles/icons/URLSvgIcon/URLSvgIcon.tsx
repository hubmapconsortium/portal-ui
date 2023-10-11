import { Box } from '@mui/material';
import React from 'react';

interface URLSvgIconProps extends React.ComponentProps<typeof Box<'div'>> {
  iconURL: string;
  ariaLabel: string;
}

function URLSvgIcon({ iconURL, ariaLabel, ...rest }: URLSvgIconProps) {
  return (
    <Box
      sx={(theme) => ({
        maskImage: `url(${iconURL})`,
        backgroundColor: theme.palette.primary.main,
        maskRepeat: 'no-repeat',
        width: theme.spacing(3),
        height: theme.spacing(3),
      })}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    />
  );
}

export default URLSvgIcon;
