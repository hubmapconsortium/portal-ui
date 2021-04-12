import styled from 'styled-components';

const StyledDiv = styled.div`
  // additional margin beyond the default 16px page margin
  @media (min-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    margin-top: ${(props) => props.theme.spacing(4)}px;
  }
`;

export { StyledDiv };
