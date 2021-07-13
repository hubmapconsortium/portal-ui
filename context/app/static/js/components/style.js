import styled from 'styled-components';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  margin: ${(props) => props.theme.spacing(3)}px;
  margin-bottom: 0;
`;

export { StyledAlert };
