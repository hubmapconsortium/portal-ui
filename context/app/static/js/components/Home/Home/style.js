import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const OuterGrid = styled.div`
  flex-grow: 1;
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'summary' 'about' 'inner' 'associations';
`;

// 88px = height + margin of header
const UpperInnerGrid = styled(Container)`
  grid-area: summary;
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'data' 'bar';
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    min-height: calc(100vh - 88px);
    grid-template-rows: auto 1fr;
  }
`;

const LowerInnerGrid = styled(Container)`
  grid-area: inner;
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'workflow' 'guidelines' 'timeline';

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'workflow timeline' 'guidelines timeline';
  }
`;

export { OuterGrid, UpperInnerGrid, LowerInnerGrid };
