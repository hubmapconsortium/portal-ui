import React from 'react';
import { NotificationIcon } from 'js/shared-styles/icons';
import { StyledContainer, StyledTypography } from './style';

function HeaderNotification({ numNotifications }: { numNotifications: number }) {
  return (
    <StyledContainer direction="row">
      <NotificationIcon fontSize="0.65rem" />
      <StyledTypography>{numNotifications}</StyledTypography>
    </StyledContainer>
  );
}

export default HeaderNotification;
