import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { EmailIcon } from 'js/shared-styles/icons';

const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2, 1)};
`;

const MainText = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(props.mt)}px;
`;

const StyledEmailIcon = styled(EmailIcon)`
  font-size: 1rem;
  vertical-align: middle;
`;

export { StyledPaper, MainText, StyledEmailIcon };
