import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import { InternalLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import MaintenanceFallbackMessage from './MaintenanceFallbackMessage';

const MaintenanceErrorDisplay = lazy(() => import('./MaintenanceErrorDisplay'));

function LoginLink() {
  return <InternalLink href="/login">login</InternalLink>;
}
function ErrorBody({ errorCode, urlPath, isAuthenticated, isGlobus401, isMaintenancePage }) {
  if (isMaintenancePage) {
    return (
      <Suspense fallback={<MaintenanceFallbackMessage />}>
        <MaintenanceErrorDisplay />
      </Suspense>
    );
  }

  if (errorCode === 401 && isGlobus401) {
    return (
      <>
        Your credentials have expired. Please <LoginLink /> again.
      </>
    );
  }

  if (errorCode === 403 && isAuthenticated) {
    return (
      <>
        You may not have access to this resource. Please <ContactUsLink /> to request access.
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
        If this page should exist, <ContactUsLink>submit a bug report</ContactUsLink>.
      </>
    );
  }

  return (
    <>
      If this problem persists, <ContactUsLink>submit a bug report</ContactUsLink>.
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
