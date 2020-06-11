import styled from 'styled-components';
import Link from '@material-ui/core/Link';

const Flex = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    flex-direction: column;
  }
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { Flex, StyledLink };
