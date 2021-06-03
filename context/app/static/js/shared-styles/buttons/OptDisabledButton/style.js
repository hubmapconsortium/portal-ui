import styled from 'styled-components';
import Button from '@material-ui/core/Button';

// Ensure font color update after being disabled
const StyledButton = styled(Button)`
  transition: color 0.01s;
`;

export { StyledButton };
