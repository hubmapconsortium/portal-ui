import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { SuccessIcon, ErrorIcon, InfoIcon } from './icons';

export const workspaceStatusIconMap: Record<string, { icon: typeof SvgIcon; color: SvgIconProps['color'] }> = {
  active: { icon: SuccessIcon, color: 'success' },
  idle: { icon: InfoIcon, color: 'info' },
  deleting: { icon: InfoIcon, color: 'info' },
  error: { icon: ErrorIcon, color: 'error' },
} as const;
