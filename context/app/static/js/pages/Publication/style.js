import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { EmailIcon } from 'js/shared-styles/icons';

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
  margin-bottom: 16px;

  h2 {
    padding: 20px 0px;
  }
`;

const StyledEmailIcon = styled(EmailIcon)`
  font-size: 1rem;
  vertical-align: middle;
`;

export { StyledPaper, StyledEmailIcon };
