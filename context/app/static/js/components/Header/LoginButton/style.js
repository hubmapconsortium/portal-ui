import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const WhiteButton = styled(Button)`
  width: 136px;
  background-color: #ffffff;
`;

const Link = styled.a`
  color: ${(props) => props.theme.palette.primary.main};
`;

export { WhiteButton, Link };
