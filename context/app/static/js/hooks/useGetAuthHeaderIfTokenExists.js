import React from 'react';
import { readCookie } from 'js/helpers/functions';

export function useGetAuthHeaderIfNexusTokenCookieExists() {
  const authHeader = React.useMemo(() => {
    const nexus_token = readCookie('nexus_token');
    return nexus_token
      ? {
          Authorization: `Bearer ${nexus_token}`,
        }
      : {};
  }, []);
  return authHeader;
}
