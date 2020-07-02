import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
  margin-top: ${(props) => (props.$fileBrowserDisplayed ? props.theme.spacing(2) : 0)}px;
  background-color: #ffffff;
  border: 1px solid black;
`;

export { StyledButton };
