import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const LoginLink = () => <LightBlueLink href="/login">login</LightBlueLink>;
const HelpEmailLink = () => (
  <LightBlueLink href="mailto:help@hubmapconsortium.org">help@hubmapconsortium.org</LightBlueLink>
);

function ErrorBody({ errorCode, urlPath, isAuthenticated, isGlobus401, isMaintenancePage }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      setMessage((await import(/* webpackChunkName: "message" */ './message.json')).default);
    }
    fetchMessage();
  }, []);

  if (isMaintenancePage) {
    return (
      <>
        {message} While the portal is under maintenance, visit the{' '}
        <OutboundLink href="https://hubmapconsortium.org/">HuBMAP Consortium</OutboundLink> website.
      </>
    );
  }

  if (errorCode === 401 && isGlobus401) {
    return (
      <>
        Your credentials have expired. Please <LoginLink /> again.
      </>
    );
  }

  if (errorCode === 401) {
    return (
      <>
        Could not confirm your Globus credentials. You may not have been added to the HuBMAP Group on Globus. Request
        access at <HelpEmailLink />. Or, you may be logged into a different Globus account from the one in the HuBMAP
        Group. Check <OutboundLink href="http://app.globus.org/">http://app.globus.org/</OutboundLink> for details on
        account.
      </>
    );
  }

  if (errorCode === 403 && isAuthenticated) {
    return (
      <>
        You may not have access to this resource. Request access at <HelpEmailLink />.
      </>
    );
  }

  if (errorCode === 403) {
    return (
      <>
        You may not have access to this resource or you need to <LoginLink />.
      </>
    );
  }

  if (errorCode === 404) {
    if (urlPath && urlPath.startsWith('/browse/')) {
      const uuid = urlPath.split('/').pop().split('.')[0];
      if (uuid.length !== 32) {
        return (
          <>
            UUIDs should be 32 characters, but <code>{uuid}</code> is {uuid.length}. Check whether the URL was
            copy-and-pasted incorrectly.
          </>
        );
      }
    }
    return (
      <>
        If this page should exist, submit a bug report to <HelpEmailLink />.
      </>
    );
  }

  return (
    <>
      If this problem persists, submit a bug report to <HelpEmailLink />.
    </>
  );
}

ErrorBody.propTypes = {
  errorCode: PropTypes.number,
  urlPath: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isGlobus401: PropTypes.bool,
  isMaintenancePage: PropTypes.bool,
};

ErrorBody.defaultProps = {
  errorCode: undefined,
  urlPath: undefined,
  isAuthenticated: false,
  isGlobus401: false,
  isMaintenancePage: false,
};

export default ErrorBody;
