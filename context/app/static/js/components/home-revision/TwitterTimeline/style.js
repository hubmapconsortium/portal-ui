import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled(Paper)`
  max-height: 374px;

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: 100%;
  }
`;

export { Wrapper };
