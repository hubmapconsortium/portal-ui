import React from 'react';
import prettyBytes from 'pretty-bytes';
import Typography, { TypographyProps } from '@mui/material/Typography';

type FileSizeProps = {
  size: number;
  variant?: TypographyProps['variant'];
};

export function FileSize({ size, variant = 'body2' }: FileSizeProps) {
  return (
    <Typography component="p" variant={variant} color="#00000099">
      {prettyBytes(size)}
    </Typography>
  );
}
