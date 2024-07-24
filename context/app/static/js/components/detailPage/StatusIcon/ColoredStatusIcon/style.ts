import React from 'react';
import { styled } from '@mui/material/styles';
import { InfoRounded, ErrorRounded, WarningRounded, CheckCircleRounded } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

export interface ColoredStatusIconProps extends SvgIconProps {
  $iconStatus: 'info' | 'success' | 'warning' | 'error';
}

export const iconSymbolStatusMap: {
  [key in ColoredStatusIconProps['$iconStatus']]: React.ComponentType<SvgIconProps>;
} = {
  info: InfoRounded,
  success: CheckCircleRounded,
  warning: WarningRounded,
  error: ErrorRounded,
};

export const getStyledIcon = (
  IconComponent: React.ComponentType<SvgIconProps>,
  $iconStatus: ColoredStatusIconProps['$iconStatus'],
) =>
  styled(IconComponent)(({ theme }) => ({
    color: theme.palette[$iconStatus].main,
    fontSize: 16,
    marginRight: 3,
    alignSelf: 'center',
  }));
