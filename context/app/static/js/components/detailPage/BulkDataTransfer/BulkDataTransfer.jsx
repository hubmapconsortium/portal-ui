import React from 'react';
import { useAppContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import NotLoggedIn from './NotLoggedIn';
import LoggedIn from './LoggedIn';

function BulkDataTransfer() {
  const { isAuthenticated } = useAppContext();
  return (
    <>
      <SectionHeader>Bulk Data Transfer</SectionHeader>
      {isAuthenticated === true ? <LoggedIn /> : <NotLoggedIn />}
    </>
  );
}

export default BulkDataTransfer;
