import React from 'react';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { FlexContainer, StyledHeaderIcon } from './style';

function IconPageTitle({ icon, children, iconProps, ...rest }) {
  return (
    <FlexContainer {...rest}>
      <StyledHeaderIcon component={icon} color="primary" {...iconProps} />
      <PageTitle>{children}</PageTitle>
    </FlexContainer>
  );
}

export default IconPageTitle;
