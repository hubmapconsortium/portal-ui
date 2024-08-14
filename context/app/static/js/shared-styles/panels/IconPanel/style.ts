import { SvgIconProps } from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';

export const getStyledIcon = (IconComponent: React.ComponentType<SvgIconProps>) =>
  styled(IconComponent)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  }));
