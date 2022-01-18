import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const GridAreaContainer = styled(Container)`
  grid-area: ${(props) => props.$gridAreaTitle};
`;

const GridArea = styled.div`
  grid-area: ${(props) => props.$gridAreaTitle};
`;

const FlexGridArea = styled(GridArea)`
  display: flex;
  flex-direction: column;
`;

const FlexGrowDiv = styled.div`
  flex: 1;
`;

const UpperGrid = styled.div`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(5)}px;
  grid-template-areas: 'title' 'carousel' 'counts';
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
`;

const LowerContainerGrid = styled(Container)`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'guidelines' 'timeline' 'external-links';
  margin-bottom: ${(props) => props.theme.spacing(5)}px;

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'bar-chart bar-chart' 'guidelines timeline' 'external-links timeline';
  }
`;

const SectionHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)}px;
`;

const OffsetDatasetsHeader = styled(SectionHeader)`
  scroll-margin-top: ${headerHeight + 10}px;
`;

export {
  GridAreaContainer,
  GridArea,
  UpperGrid,
  LowerContainerGrid,
  SectionHeader,
  OffsetDatasetsHeader,
  FlexGridArea,
  FlexGrowDiv,
};
