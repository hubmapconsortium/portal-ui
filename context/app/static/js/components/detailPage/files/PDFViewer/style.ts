import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import LinearProgress from '@mui/material/LinearProgress';

const ModalContentWrapper = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const StyledIconButton = styled(IconButton)({
  // mui uses padding for icon button sizes which causes buttons with different size icons to vary in size
  boxSizing: 'border-box',
  width: '30px',
  height: '30px',
  position: 'absolute',
  top: '-14px',
  right: '-14px',
});

const StyledCloseIcon = styled(CancelRoundedIcon)({
  backgroundColor: '#fff',
  borderRadius: '100%',
});

const ErrorIcon = styled(ErrorRoundedIcon)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '1.25rem',
  marginRight: theme.spacing(0.5),
}));

const StyledLinearProgress = styled(LinearProgress)(() => ({
  maxWidth: '100px',
}));

export { ModalContentWrapper, StyledIconButton, StyledCloseIcon, ErrorIcon, StyledLinearProgress };
