import { styled } from '@mui/material/styles';
import LensIcon from '@mui/icons-material/LensRounded';

import { ExternalLinkIcon } from 'js/shared-styles/icons';

interface ColoredStatusIconProps {
  $iconColor: 'success' | 'warning' | 'error' | 'info';
}

// Default font-size is too large, and causes vertical misalignment
// of text in this cell. 0.8rem works, but somewhat arbitrary.
// "vertical-align: sub" looks better than "baseline",
// but depends on size of circle.
const ColoredStatusIcon = styled(LensIcon)<ColoredStatusIconProps>(({ theme, $iconColor }) => ({
  color: theme.palette[$iconColor].main,
  fontSize: '0.8rem',
  marginRight: '3px',
  verticalAlign: 'sub',
}));

const StyledExternalLinkIcon = styled(ExternalLinkIcon)({
  fontSize: '1rem',
  verticalAlign: 'top',
});

export { ColoredStatusIcon, StyledExternalLinkIcon };
