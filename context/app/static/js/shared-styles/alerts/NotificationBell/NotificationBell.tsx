import React from 'react';
import { NotificationIcon } from 'js/shared-styles/icons';
import { StyledContainer, StyledTypography } from './style';

interface NotificationBellProps {
  numNotifications: number;
  notificationTitle?: string;
}
function NotificationBell({ numNotifications, notificationTitle }: NotificationBellProps) {
  if (numNotifications === 0) {
    return null;
  }

  return (
    <StyledContainer direction="row">
      <NotificationIcon fontSize="0.65rem" />
      <StyledTypography>
        {numNotifications} {notificationTitle}
      </StyledTypography>
    </StyledContainer>
  );
}

export default NotificationBell;
