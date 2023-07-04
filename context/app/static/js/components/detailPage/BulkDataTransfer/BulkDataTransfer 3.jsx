import React from 'react';
import { useAppContext } from 'js/components/Contexts';
import NotLoggedIn from './NotLoggedIn';
import LoggedIn from './LoggedIn';

function BulkDataTransfer() {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated === true ? <LoggedIn /> : <NotLoggedIn />;
}

export default BulkDataTransfer;
