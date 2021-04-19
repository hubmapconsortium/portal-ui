import styled from 'styled-components';
import Container from '@material-ui/core/Container';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const GridAreaContainer = styled(Container)`
  grid-area: ${(props) => props.$gridAreaTitle};
`;

const GridArea = styled.div`
  grid-area: ${(props) => props.$gridAreaTitle};
`;

const AboveTheFoldGrid = styled.div`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'title' 'description' 'carousel';
  @media (min-width: ${(props) => props.theme.breakpoints.values.lg}px) {
    height: calc(100vh - ${headerHeight + 16}px);
    grid-template-rows: auto auto 1fr;
  }
`;

const LowerContainerGrid = styled(Container)`
  display: grid;
  grid-gap: ${(props) => props.theme.spacing(3)}px;
  grid-template-areas: 'guidelines' 'timeline' 'external-links';

  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    grid-template-columns: 3fr 1fr;
    grid-template-areas: 'bar-chart bar-chart' 'guidelines timeline' 'external-links timeline';
  }
`;

export { GridAreaContainer, GridArea, AboveTheFoldGrid, LowerContainerGrid };
