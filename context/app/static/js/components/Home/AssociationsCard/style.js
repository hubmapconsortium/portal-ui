import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

const Card = styled(Paper)`
  width: 400px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => props.theme.spacing(1, 2)};
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { Card, StyledLink };
