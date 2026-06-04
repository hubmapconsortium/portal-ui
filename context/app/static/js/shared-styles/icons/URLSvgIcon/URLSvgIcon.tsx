import Box from '@mui/material/Box';
import React, { ElementType } from 'react';

export interface URLSvgIconProps extends React.ComponentProps<typeof Box> {
  iconURL: string;
  ariaLabel: string;
  invertColors?: boolean;
  // Polymorphic root override. React.ComponentProps<typeof Box> intentionally
  // drops the polymorphic `component` prop, so we re-declare it here.
  component?: ElementType;
}

function URLSvgIcon({ iconURL, ariaLabel, invertColors, component, ...rest }: URLSvgIconProps) {
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
      {...(component ? { component } : {})}
      {...rest}
    />
  );
}

export default URLSvgIcon;
