import React from 'react';
import prettyBytes from 'pretty-bytes';
import Typography, { TypographyProps } from '@mui/material/Typography';

interface FileSizeProps {
  size: number;
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
}

export function FileSize({ size, variant = 'body2', color = 'black' }: FileSizeProps) {
  return (
    <Typography component="p" variant={variant} color={color}>
      {prettyBytes(size)}
    </Typography>
  );
}
