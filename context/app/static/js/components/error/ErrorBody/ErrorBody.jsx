import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

const LoginLink = () => <LightBlueLink href="/login">login</LightBlueLink>;
const HelpEmailLink = () => (
  <LightBlueLink href="mailto:help@hubmapconsortium.org">help@hubmapconsortium.org</LightBlueLink>
);

function ErrorBody({ errorCode, isAuthenticated, isGlobus401, isMaintenancePage }) {
  if (isMaintenancePage) {
    return (
      <>
        While the portal is under maintenance, visit the{' '}
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
        Could not confirm your Globus credentials.
        <ul>
          <li>
            You may not have been added to the HuBMAP Group on Globus. Request access at <HelpEmailLink />.
          </li>
          <li>
            Or, you may be logged into a different Globus account from the one in the HuBMAP Group. Check{' '}
            <OutboundLink href="http://app.globus.org/">http://app.globus.org/</OutboundLink> for details on your
            account.
          </li>
        </ul>
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
  isAuthenticated: PropTypes.bool,
  isGlobus401: PropTypes.bool,
  isMaintenancePage: PropTypes.bool,
};

ErrorBody.defaultProps = {
  errorCode: undefined,
  isAuthenticated: false,
  isGlobus401: false,
  isMaintenancePage: false,
};

export default ErrorBody;
