import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

import { InfoIcon } from 'js/shared-styles/icons';

const FlexPaper = styled(Paper)`
  padding: 30px 40px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

export { FlexPaper, StyledInfoIcon };
