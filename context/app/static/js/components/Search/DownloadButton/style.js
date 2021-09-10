import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  background-color: white;
  height: 40px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.palette.secondary.main};
`;

export { StyledButton };
