import styled from 'styled-components';
import Container from '@material-ui/core/Container';

import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const GridArea = styled(Container)`
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

export { GridArea, AboveTheFoldGrid };
