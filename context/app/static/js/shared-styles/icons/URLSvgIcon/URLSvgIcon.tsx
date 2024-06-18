import Box from '@mui/material/Box';
import React from 'react';

export interface URLSvgIconProps extends React.ComponentProps<typeof Box> {
  iconURL: string;
  ariaLabel: string;
  invertColors?: boolean;
}

function URLSvgIcon({ iconURL, ariaLabel, invertColors, ...rest }: URLSvgIconProps) {
  return (
    <Box
      sx={({ spacing, palette }) => ({
        maskImage: `url(${iconURL})`,
        backgroundColor: palette[invertColors ? 'white' : 'primary'].main,
        maskRepeat: 'no-repeat',
        width: spacing(3),
        height: spacing(3),
      })}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    />
  );
}

export default URLSvgIcon;
