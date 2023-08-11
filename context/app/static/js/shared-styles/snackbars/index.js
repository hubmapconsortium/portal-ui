import styled from 'styled-components';
import Snackbar from '@mui/material/Snackbar';

const SuccessSnackbar = styled(Snackbar)`
  & > div {
    background-color: ${(props) => props.theme.palette.success.main};
    color: ${(props) => (props.$isWarning ? '#000000' : props.theme.palette.white.main)};
  }
`;

const ErrorSnackbar = styled(Snackbar)`
  position: absolute;
  background-color: ${(props) => props.theme.palette.white.main};
`;

export { ErrorSnackbar, SuccessSnackbar };
