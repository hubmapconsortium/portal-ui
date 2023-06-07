import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)};
  // additional margin beyond the default 16px page margin
  @media (min-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    margin-top: ${(props) => props.theme.spacing(4)};
  }
`;

export { StyledDiv };
