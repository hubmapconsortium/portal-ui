import styled from 'styled-components';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const StyledWhiteButton = styled(WhiteBackgroundIconButton)`
  margin-left: 0.5rem;
`;

const StyledLinkIcon = styled(LinkIcon)`
  margin-left: auto;
`;
const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;
const StyledEmailIcon = styled(EmailIcon)`
  margin-left: auto;
`;

export { StyledWhiteButton, StyledLinkIcon, StyledTypography, StyledEmailIcon };
