import { styled } from '@mui/material/styles';
import LinkIcon from '@mui/icons-material/Link';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';

const StyledLinkIcon = styled(LinkIcon)({
  marginLeft: 'auto',
});

const StyledTypography = styled(Typography)({
  flexGrow: 1,
});

const StyledEmailIcon = styled(EmailIcon)({
  marginLeft: 'auto',
});

export { StyledLinkIcon, StyledTypography, StyledEmailIcon };
