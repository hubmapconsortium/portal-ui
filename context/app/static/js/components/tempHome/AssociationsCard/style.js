import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

const Card = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${(props) => props.theme.spacing(1, 2)};
  margin-bottom: ${(props) => (props.mb ? `${props.theme.spacing(2)}px` : '0px')};

  @media (min-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    width: 400px;
    height: 250px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.values.lg}px) {
    margin-bottom: 0px;
  }
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { Card, StyledLink };
