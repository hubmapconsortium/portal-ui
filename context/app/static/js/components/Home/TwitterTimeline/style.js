import styled from 'styled-components';

// TODO move away from react-twitter-embedded
const Wrapper = styled.div`
  grid-area: timeline;
  height: 374px;
  iframe {
    max-height: 374px;
    height: 374px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: 624px;
    iframe {
      max-height: 624px;
      height: 624px;
    }
  }
`;

export { Wrapper };
