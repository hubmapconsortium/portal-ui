import styled from 'styled-components';
import Snackbar from '@mui/material/Snackbar';

import { useSnackbarStore, SnackbarProvider, createStore } from './store';

const SuccessSnackbar = styled(Snackbar)`
  & > div {
    background-color: ${(props) => props.theme.palette.success.main};
    color: ${(props) => (props.$isWarning ? '#000000' : props.theme.palette.white.main)};
  }
`;

export { SuccessSnackbar, useSnackbarStore, SnackbarProvider, createStore };
