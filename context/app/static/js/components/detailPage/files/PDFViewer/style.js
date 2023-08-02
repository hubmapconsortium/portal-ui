import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import LinearProgress from '@mui/material/LinearProgress';

const ModalContentWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledIconButton = styled(IconButton)`
  // mui uses padding for icon button sizes which causes buttons with different size icons to vary in size
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  position: absolute;
  top: -14px;
  right: -14px;
`;

const StyledCloseIcon = styled(CancelRoundedIcon)`
  background-color: #fff;
  border-radius: 100%;
`;

const ButtonWrapper = styled.div`
  min-width: 125px;
`;

const Flex = styled.div`
  display: flex;
`;

const ErrorIcon = styled(ErrorRoundedIcon)`
  color: ${(props) => props.theme.palette.error.main};
  font-size: 1.25rem;
  margin-right: ${(props) => props.theme.spacing(0.5)};
`;

const StyledLinearProgress = styled(LinearProgress)`
  max-width: 100px;
`;

export { ModalContentWrapper, StyledIconButton, StyledCloseIcon, ButtonWrapper, Flex, ErrorIcon, StyledLinearProgress };
