import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledContainer = styled(Box)({
  position: 'relative',
  display: 'inline-block',
});

const StyledNotificationContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  transform: 'translate(70%, -45%)',
});

export { StyledContainer, StyledNotificationContainer };
