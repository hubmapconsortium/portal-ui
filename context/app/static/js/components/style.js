import styled from 'styled-components';
import Container from '@mui/material/Container';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  width: ${(props) => props.theme.breakpoints.values.lg}px;
  margin-top: ${(props) => props.theme.spacing(3)};
  z-index: 0; // Does not display on preview pages without this; Not sure sure why not.
  display: flex;
  align-items: center;
`;

const FlexContainer = styled(Container)`
  display: flex;
  height: 100%;
  align-items: center;
`;

export { StyledAlert, FlexContainer };
