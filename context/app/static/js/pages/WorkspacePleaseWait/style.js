import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(3)}px;
`;

export { StyledAlert };
