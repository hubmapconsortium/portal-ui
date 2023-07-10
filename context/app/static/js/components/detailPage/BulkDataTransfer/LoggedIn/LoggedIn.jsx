import React from 'react';
// import ProtectedAccess from './ProtectedAccess';
// import NoProtectedAccess from './NoProtectedAccess';
// import NonConsortiumMembers from './NonConsortiumMembers';
import QA from './QA';

function LoggedIn() {
  return (
    <>
      {/* <ProtectedAccess />
      <NoProtectedAccess />
      <NonConsortiumMembers /> */}
      <QA />
    </>
  );
}

export default LoggedIn;
