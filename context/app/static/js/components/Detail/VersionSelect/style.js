import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
  background-color: #fff;
  svg {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

export { StyledButton };
