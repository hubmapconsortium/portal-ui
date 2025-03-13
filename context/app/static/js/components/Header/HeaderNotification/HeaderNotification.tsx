import React from 'react';
import { NotificationIcon } from 'js/shared-styles/icons';
import { StyledContainer, StyledTypography } from './style';

function HeaderNotification({ numNotifications }: { numNotifications: number }) {
  if (numNotifications === 0) {
    return null;
  }

  return (
    <StyledContainer direction="row">
      <NotificationIcon fontSize="0.65rem" />
      <StyledTypography>{numNotifications}</StyledTypography>
    </StyledContainer>
  );
}

export default HeaderNotification;
