import React from 'react';
import { NotificationIcon } from 'js/shared-styles/icons';
import { StyledContainer } from './style';

function HeaderNotification({ numNotifications }: { numNotifications: number }) {
  return (
    <StyledContainer direction="row">
      <NotificationIcon fontSize="0.65rem" />
      {numNotifications}
    </StyledContainer>
  );
}

export default HeaderNotification;
