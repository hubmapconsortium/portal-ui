import { styled } from '@mui/material/styles';
import React from 'react';

const LinkButton = styled('a')(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.white.main,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main,
  marginTop: theme.spacing(1),
  width: '175px',
  boxSizing: 'content-box',
  padding: theme.spacing(1, 4),
  textAlign: 'center',
  '&:hover': {
    boxShadow: theme.shadows[8],
    filter: theme.palette.primary.hover,
  },
})) as React.ComponentType<'a'>;

export { LinkButton };
