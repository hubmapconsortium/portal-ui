import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const OuterGrid = styled.div`
  flex-grow: 1;
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'summary' 'about' 'inner' 'associations';
`;

const SummaryContainer = styled(Container)`
  grid-area: summary;
`;

const InnerGrid = styled(Container)`
  grid-area: inner;
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-columns: 3fr 1fr;
  grid-template-areas: 'workflow timeline' 'guidelines timeline';
`;

export { OuterGrid, SummaryContainer, InnerGrid };
