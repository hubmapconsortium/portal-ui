import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import {
  MyLists,
  MyWorkspaces,
  MyPreferences,
  ProfileSummary,
  ProfileSummaryUnauthenticated,
} from 'js/components/profile';

const shouldDisplaySectionAuthenticated = {
  summary: true,
  'my-lists': true,
  'my-workspaces': true,
  'my-preferences': true,
};

const shouldDisplaySectionUnauthenticated = {
  summary: true,
  'my-preferences': true,
};

function ProfilePage() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return (
      <DetailLayout sections={shouldDisplaySectionUnauthenticated}>
        <ProfileSummaryUnauthenticated />
        <MyPreferences />
      </DetailLayout>
    );
  }

  return (
    <DetailLayout sections={shouldDisplaySectionAuthenticated}>
      <ProfileSummary />
      <MyLists />
      <MyWorkspaces />
      <MyPreferences />
    </DetailLayout>
  );
}

export default ProfilePage;
