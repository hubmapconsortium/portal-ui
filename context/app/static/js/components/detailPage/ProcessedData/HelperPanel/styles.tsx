import React from 'react';

import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

export const HelperPanelButton = styled((props: ButtonProps) => <Button {...props} variant="outlined" />)(
  ({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: theme.spacing(0.5),
    whiteSpace: 'nowrap',
  }),
);
