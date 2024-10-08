import React from 'react';
import Stack from '@mui/material/Stack';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';
import { StyledHeaderIcon } from './style';

interface IconPageTitleProps {
  icon: MUIIcon;
  iconProps?: Record<string, unknown>;
}

function IconPageTitle({ icon, children, iconProps, ...rest }: React.PropsWithChildren<IconPageTitleProps>) {
  return (
    <Stack direction="row" alignItems="center" {...rest}>
      <StyledHeaderIcon component={icon} color="primary" {...iconProps} />
      <PageTitle>{children}</PageTitle>
    </Stack>
  );
}

export default IconPageTitle;
