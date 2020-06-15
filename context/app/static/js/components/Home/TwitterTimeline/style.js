import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: timeline;
  iframe {
    max-height: 374px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    iframe {
      max-height: 624px;
    }
  }
`;

export { Wrapper };
