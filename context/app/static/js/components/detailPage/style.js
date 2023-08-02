import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import Section, { baseOffset } from 'js/shared-styles/sections/Section';

const DetailPageAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const DetailPageSection = styled(Section)`
  scroll-margin-top: ${baseOffset + entityHeaderHeight}px;
`;

export { DetailPageAlert, DetailPageSection };
