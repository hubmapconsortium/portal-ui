import styled from 'styled-components';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

/* Anchor offset for fixed header.
Only to be used on pages with table of contents. */
const PaddedSectionContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
  scroll-margin-top: ${headerHeight + entityHeaderHeight + 10}px;
`;

export default PaddedSectionContainer;
