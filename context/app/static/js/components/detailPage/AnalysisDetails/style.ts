import { styled } from '@mui/material/styles';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import Divider from '@mui/material/Divider';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const CwlIcon = styled(LaunchRoundedIcon)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: '1rem',
  alignSelf: 'center',
}));

const FlexOutboundLink = styled(OutboundLink)({
  display: 'flex',
});

const PrimaryTextDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  height: '15px',
  backgroundColor: theme.palette.text.primary,
  alignSelf: 'center',
}));

const StyledListItem = styled('li')({
  display: 'flex',
});

export { CwlIcon, FlexOutboundLink, PrimaryTextDivider, StyledListItem };
