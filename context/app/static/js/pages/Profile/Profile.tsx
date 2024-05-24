import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { getSectionOrder } from 'js/components/detailPage/utils';
import { MyLists, MyWorkspaces, ProfileSummary } from 'js/components/profile';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';

const sectionOrder = getSectionOrder(['summary', 'my-lists', 'workspaces'], {});

function ProfilePage() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <LoginAlert featureName="profile pages" />;
  }

  return (
    <DetailLayout sectionOrder={sectionOrder}>
      <ProfileSummary />
      <MyLists />
      <MyWorkspaces />
    </DetailLayout>
  );
}

export default ProfilePage;
