import React from 'react';
import { Alert } from 'js/shared-styles/alerts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useAppContext } from 'js/components/Contexts';

export function ProfileDescription() {
  const { userEmail } = useAppContext();
  // ensure that the user only sees this message once per account per device
  const localStorageKey = `${userEmail}-has-seen-profile-description`;

  const hasSeenProfileDescriptionCookie = Boolean(localStorage.getItem(localStorageKey));
  const [hasSeenProfileDescription, setHasSeenProfileDescription] = React.useState(hasSeenProfileDescriptionCookie);
  if (hasSeenProfileDescription) {
    return null;
  }
  const onClose = () => {
    localStorage.setItem(localStorageKey, 'true');
    setHasSeenProfileDescription(true);
  };
  return (
    <Alert severity="info" onClose={onClose}>
      Your access levels are listed below describing your level of access regarding HuBMAP data and features.&nbsp;
      <ContactUsLink>Contact us</ContactUsLink> for additional information about your access groups.
    </Alert>
  );
}
