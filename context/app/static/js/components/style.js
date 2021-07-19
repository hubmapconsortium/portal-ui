import styled from 'styled-components';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  max-width: ${(props) => props.theme.breakpoints.values.lg}px;
  margin: ${(props) => props.theme.spacing(3)}px;
  margin-bottom: 0;
`;

export { StyledAlert };
