import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const StyledButton = styled(Button)`
  margin: 0 ${(props) => props.theme.spacing(1)}px;
  height: 40px;
`;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

export { StyledButton, StyledLink };
