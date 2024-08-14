import React from 'react';
import { styled } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ColoredStatusIconProps } from 'js/shared-styles/icons/SeverityIcon';

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
