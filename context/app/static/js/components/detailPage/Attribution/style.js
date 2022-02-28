import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { EmailIcon } from 'js/shared-styles/icons';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

const StyledEmailIcon = styled(EmailIcon)`
  font-size: 1rem;
  vertical-align: middle;
`;

export { StyledTypography, FlexPaper, StyledEmailIcon };
