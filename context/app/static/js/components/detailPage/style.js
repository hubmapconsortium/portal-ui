import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';

const DetailPageAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

export { DetailPageAlert };
