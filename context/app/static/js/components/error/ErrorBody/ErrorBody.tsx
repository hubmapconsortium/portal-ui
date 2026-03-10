import React, { lazy, Suspense } from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { MaintenanceFallbackLoader } from './MaintenanceFallbackMessage';

const MaintenanceErrorDisplay = lazy(() => import('./MaintenanceErrorDisplay'));

function LoginLink() {
  return <InternalLink href="/login">login</InternalLink>;
}

interface ErrorBodyProps {
  errorCode?: number;
  urlPath?: string;
  isAuthenticated?: boolean;
  isGlobus401?: boolean;
  isMaintenancePage?: boolean;
}

function ErrorBody({
  errorCode,
  urlPath,
  isAuthenticated = false,
  isGlobus401 = false,
  isMaintenancePage = false,
}: ErrorBodyProps) {
  if (isMaintenancePage) {
    return (
      <Suspense fallback={<MaintenanceFallbackLoader />}>
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
      const uuid = urlPath.split('/').pop()!.split('.')[0];
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

export default ErrorBody;
