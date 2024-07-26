import { styled } from '@mui/material/styles';
import { InfoRounded, ErrorRounded, WarningRounded, CheckCircleRounded } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

type IconStatus = 'info' | 'success' | 'warning' | 'error';

export interface ColoredStatusIconProps extends SvgIconProps {
  $iconStatus: IconStatus;
}

export const iconSymbolStatusMap: {
  [key in ColoredStatusIconProps['$iconStatus']]: React.ComponentType<SvgIconProps>;
} = {
  info: InfoRounded,
  success: CheckCircleRounded,
  warning: WarningRounded,
  error: ErrorRounded,
};

const styleIcon = (IconComponent: React.ComponentType<SvgIconProps>, status: IconStatus) =>
  styled(IconComponent)(({ theme }) => ({
    color: theme.palette[status].main,
    fontSize: 16,
    marginRight: 3,
    alignSelf: 'center',
  }));

const styledIcons: Record<IconStatus, ReturnType<typeof styleIcon>> = {
  info: styleIcon(InfoRounded, 'info'),
  success: styleIcon(CheckCircleRounded, 'success'),
  warning: styleIcon(WarningRounded, 'warning'),
  error: styleIcon(ErrorRounded, 'error'),
};

export const getStyledIcon = ($iconStatus: ColoredStatusIconProps['$iconStatus']) => styledIcons[$iconStatus];
