import styled from 'styled-components';
import Container from '@material-ui/core/Container';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  width: ${(props) => props.theme.breakpoints.values.lg}px;
  margin-top: ${(props) => props.theme.spacing(3)}px;
`;

const FlexContainer = styled(Container)`
  display: flex;
  height: 100%;
  align-items: center;
`;

export { StyledAlert, FlexContainer };
