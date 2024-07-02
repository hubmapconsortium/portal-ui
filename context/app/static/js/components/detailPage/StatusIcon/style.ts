import { styled } from '@mui/material/styles';
import LensIcon from '@mui/icons-material/LensRounded';

interface ColoredStatusIconProps {
  $iconColor: 'info' | 'success' | 'warning' | 'error';
}

const ColoredStatusIcon = styled(LensIcon)<ColoredStatusIconProps>(({ theme, $iconColor }) => ({
  color: theme.palette[$iconColor].main,
  fontSize: 16,
  marginRight: 3,
  alignSelf: 'center',
}));

export { ColoredStatusIcon };
