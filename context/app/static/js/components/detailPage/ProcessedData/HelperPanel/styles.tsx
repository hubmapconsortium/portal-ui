import React, { ForwardedRef, forwardRef } from 'react';

import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const OutlinedButton = forwardRef((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
  <Button ref={ref} {...props} variant="outlined" />
));

export const HelperPanelButton = styled(OutlinedButton)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.spacing(0.5),
  whiteSpace: 'nowrap',
}));
