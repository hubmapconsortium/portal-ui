import styled from 'styled-components';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const UpperGrid = styled.div`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(5)};
  grid-template-areas: 'title' 'carousel' 'counts';
  margin-bottom: ${(props) => props.theme.spacing(5)};
`;

const LowerContainerGrid = styled(Container)`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)};
  grid-template-areas: 'recent-entities' 'guidelines' 'external-links';
  margin-bottom: ${(props) => props.theme.spacing(5)};

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    grid-template-areas: 'bar-chart' 'recent-entities' 'guidelines' 'external-links';
  }
`;

const SectionHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)};
`;

const OffsetDatasetsHeader = styled(SectionHeader)`
  scroll-margin-top: ${headerHeight + 10}px;
`;

export { UpperGrid, LowerContainerGrid, SectionHeader, OffsetDatasetsHeader };
