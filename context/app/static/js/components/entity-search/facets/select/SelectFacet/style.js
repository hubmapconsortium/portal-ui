import styled from 'styled-components';
import FormGroup from '@material-ui/core/FormGroup';

import { buildScrollShadows } from 'js/shared-styles/scrollShadows';

const StyledFormGroup = styled(FormGroup)`
  max-height: 250px;
  overflow-y: auto;
  display: block;
  padding-right: ${(props) => props.theme.spacing(1.5)}px; // Adds space for the scrollbar.

  ${buildScrollShadows()}
`;

export { StyledFormGroup };
