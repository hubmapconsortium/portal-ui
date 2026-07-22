import React from 'react';
import { LinkProps } from '@mui/material/Link';

import { useAppContext } from 'js/components/Contexts';
import OutboundLink from './OutboundLink';

/**
 * The workspaces sign-up form URL, with the user's details prefilled as query params
 * when they are signed in.
 */
export function useWorkspacesSignUpHref() {
  const { userEmail, userFirstName, userLastName, userGlobusAffiliation, userGlobusId } = useAppContext();

  const queryParams = new URLSearchParams();

  if (userEmail) {
    queryParams.set('email_address', userEmail);
  }

  if (userFirstName) {
    queryParams.set('first_name', userFirstName);
  }

  if (userLastName) {
    queryParams.set('last_name', userLastName);
  }

  if (userGlobusId) {
    queryParams.set('globus_id', userGlobusId);
  }

  if (userGlobusAffiliation) {
    queryParams.set('globus_affiliation', userGlobusAffiliation);
  }

  const queryString = queryParams.toString();
  return `https://hubmapconsortium.org/workspaces-sign-up/${queryString ? `?${queryString}` : ''}`;
}

function SignUpForWorkspacesLink({ children, ...props }: Omit<LinkProps, 'href'>) {
  const href = useWorkspacesSignUpHref();

  return (
    <OutboundLink {...props} href={href}>
      {children}
    </OutboundLink>
  );
}

export default SignUpForWorkspacesLink;
