import styled from 'styled-components';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
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
  grid-gap: ${(props) => props.theme.spacing(5)};
  grid-template-areas: 'title' 'carousel' 'counts';
  margin-bottom: ${(props) => props.theme.spacing(5)};
`;

const LowerContainerGrid = styled(Container)`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)};
  grid-template-areas: 'guidelines' 'external-links';
  margin-bottom: ${(props) => props.theme.spacing(5)};

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    grid-template-areas: 'bar-chart' 'guidelines' 'external-links';
  }
`;

const SectionHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)};
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
