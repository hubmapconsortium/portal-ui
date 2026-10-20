import React from 'react';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import { mergeSx } from 'js/helpers/styled';

interface SectionItemProps extends BoxProps {
  ml?: boolean;
  label?: string;
}

function SectionItem({ children, ml, label, ...rest }: SectionItemProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <Box
      {...rest}
      sx={mergeSx(
        {
          ml: ml ? '75px' : undefined,
        },
        rest.sx,
      )}
    >
      {label && (
        <Typography variant="subtitle2" component="h3" color="primary">
          {label}
        </Typography>
      )}

      {childrenArray.map((child, i) => (
        <Typography key={`value-${i}`} variant="h6" component="p">
          {child}
        </Typography>
      ))}
    </Box>
  );
}

export default SectionItem;
