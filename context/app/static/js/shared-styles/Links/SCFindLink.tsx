import React, { PropsWithChildren } from 'react';
import InternalLink from './InternalLink';

/**
 * Links to the in-app scFind Method page (`/scfind/about`). That page itself links out to the
 * original scFind publication; everywhere else points here so users land on the portal's overview.
 */
export default function SCFindLink({ children = 'scFind method' }: PropsWithChildren) {
  return <InternalLink href="/scfind/about">{children}</InternalLink>;
}
