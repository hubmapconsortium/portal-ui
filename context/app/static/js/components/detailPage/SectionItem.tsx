/* eslint-disable react/no-array-index-key */
import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface SectionItemProps extends PropsWithChildren {
  ml?: boolean;
  label?: string;
  flexBasis?: string;
}

function SectionItem({ children, ml, label, flexBasis, ...rest }: SectionItemProps) {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <Box ml={ml ? '75px' : undefined} flexBasis={flexBasis} {...rest}>
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
