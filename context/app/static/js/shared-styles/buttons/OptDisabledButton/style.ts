import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Ensure font color update after being disabled
const StyledButton = styled(Button)({
  transition: 'color 0.01s',
});

export { StyledButton };
