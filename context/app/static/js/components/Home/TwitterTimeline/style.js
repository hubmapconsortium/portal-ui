import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: timeline;
  height: 374px;

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: 624px;
  }
`;

export { Wrapper };
