import React from 'react';
import { useAppContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import NotLoggedIn from './NotLoggedIn';
import LoggedIn from './LoggedIn';

function BulkDataTransfer() {
  const { isAuthenticated } = useAppContext();
  return (
    <DetailPageSection id="bulkDataTransfer">
      <SectionHeader>Bulk Data Transfer</SectionHeader>
      {isAuthenticated === true ? <LoggedIn /> : <NotLoggedIn />}
    </DetailPageSection>
  );
}

export default BulkDataTransfer;
