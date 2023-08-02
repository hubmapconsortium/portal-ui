import styled from 'styled-components';
import FormGroup from '@mui/material/FormGroup';

import { buildScrollShadows } from 'js/shared-styles/scrollShadows';

const StyledFormGroup = styled(FormGroup)`
  max-height: 250px;
  overflow-y: auto;
  display: block;
  padding-right: ${(props) => props.theme.spacing(1.5)}; // Adds space for the scrollbar.

  ${buildScrollShadows()}
`;

export { StyledFormGroup };
