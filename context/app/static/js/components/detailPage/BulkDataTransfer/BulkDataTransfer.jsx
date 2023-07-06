import React from 'react';
import { useAppContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import NotLoggedIn from './NotLoggedIn';
import LoggedIn from './LoggedIn';

function BulkDataTransfer() {
  const { isAuthenticated } = useAppContext();
  return (
    <DetailPageSection id="bulk-data-transfer">
      <SectionHeader>Bulk Data Transfer</SectionHeader>
      {isAuthenticated ? <LoggedIn /> : <NotLoggedIn />}
    </DetailPageSection>
  );
}

export default BulkDataTransfer;
