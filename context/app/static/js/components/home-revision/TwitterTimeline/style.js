import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled(Paper)`
  height: 374px;
  // The autoHeight from react-twitter-embed is buggy, setting max-height for the iframe fixes that
  iframe {
    max-height: 374px;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: 100%;
    iframe {
      max-height: 100%;
    }
  }
`;

export { Wrapper };
