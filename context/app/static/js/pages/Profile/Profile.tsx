import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { MyLists, MyWorkspaces, MyPreferences, ProfileSummary } from 'js/components/profile';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';

const shouldDisplaySection = {
  summary: true,
  'my-lists': true,
  'my-workspaces': true,
  'my-preferences': true,
};

function ProfilePage() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <LoginAlert featureName="profile pages" />;
  }

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <ProfileSummary />
      <MyLists />
      <MyWorkspaces />
      <MyPreferences />
    </DetailLayout>
  );
}

export default ProfilePage;
