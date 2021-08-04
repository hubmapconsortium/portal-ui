import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

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

const PaddedDiv = styled.div`
  padding: 0px 20px;
`;

const ButtonWrapper = styled.div`
  min-width: 100px;
`;

export { ModalContentWrapper, StyledIconButton, StyledCloseIcon, PaddedDiv, ButtonWrapper };
