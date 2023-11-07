import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import React from 'react';

interface URLSvgIconProps extends React.ComponentProps<typeof Box> {
  iconURL: string;
  ariaLabel: string;
  invertColors?: boolean;
}

function URLSvgIcon({ iconURL, ariaLabel, invertColors, ...rest }: URLSvgIconProps) {
  const { palette, spacing } = useTheme();
  return (
    <Box
      sx={{
        maskImage: `url(${iconURL})`,
        backgroundColor: invertColors ? palette.white.main : palette.primary.main,
        maskRepeat: 'no-repeat',
        width: spacing(3),
        height: spacing(3),
      }}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    />
  );
}

export default URLSvgIcon;
