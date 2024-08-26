import React from 'react';

import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

// TODO: Fix hover issue with tooltips - seems to be caused by ref forwarding
export const HelperPanelButton = styled((props: ButtonProps) => <Button {...props} variant="outlined" />)(
  ({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: theme.spacing(0.5),
    whiteSpace: 'nowrap',
  }),
);
