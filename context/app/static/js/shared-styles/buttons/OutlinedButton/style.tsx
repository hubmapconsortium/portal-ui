import React from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

const OutlinedButton = styled((props: ButtonProps) => <Button {...props} variant="outlined" />)(({ theme }) => ({
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(0.5),
})) as typeof Button;

export default OutlinedButton;
