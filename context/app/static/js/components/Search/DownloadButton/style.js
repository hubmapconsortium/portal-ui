import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
  margin: 0 ${(props) => props.theme.spacing(1)}px;
  height: 40px;
`;

export { StyledButton };
