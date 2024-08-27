import React, { ComponentProps } from 'react';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { FlexContainer, StyledHeaderIcon } from './style';

interface IconPageTitleProps extends ComponentProps<typeof FlexContainer> {
  icon: React.ElementType;
  iconProps?: Record<string, unknown>;
  children: React.ReactNode;
}

function IconPageTitle({ icon, children, iconProps, ...rest }: IconPageTitleProps) {
  return (
    <FlexContainer {...rest}>
      <StyledHeaderIcon component={icon} color="primary" {...iconProps} />
      <PageTitle>{children}</PageTitle>
    </FlexContainer>
  );
}

export default IconPageTitle;
