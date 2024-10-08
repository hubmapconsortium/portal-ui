import React, { useMemo } from 'react';

import { Stack } from '@mui/material';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { ContributorAPIResponse, ContactAPIResponse, normalizeContributor, normalizeContact } from './utils';

export function useNormalizedContributors(contributors: ContributorAPIResponse[]) {
  const normalizedContributors = useMemo(() => {
    return contributors.map(normalizeContributor);
  }, [contributors]);
  return normalizedContributors;
}

export function useNormalizedContacts(contacts: ContactAPIResponse[]) {
  const normalizedContacts = useMemo(() => {
    return contacts.map(normalizeContact);
  }, [contacts]);
  return normalizedContacts;
}

export function useAttributionSections(
  group_name: string,
  created_by_user_displayname: string,
  created_by_user_email: string,
  tooltips: {
    group: string;
    contact: string;
  },
  showRegisteredBy: boolean,
) {
  return useMemo(() => {
    const sections: {
      label: string;
      children: React.ReactNode;
      tooltip?: string;
    }[] = [
      {
        label: 'Group',
        children: group_name,
        tooltip: showRegisteredBy ? undefined : tooltips.group,
      },
    ];

    if (showRegisteredBy) {
      sections.push({
        label: 'Registered by',
        children: (
          <Stack spacing={1}>
            {created_by_user_displayname}
            <EmailIconLink email={encodeURI(created_by_user_email)} iconFontSize="1.1rem">
              {created_by_user_email}
            </EmailIconLink>
          </Stack>
        ),
      });
    }

    return sections;
  }, [group_name, created_by_user_displayname, created_by_user_email, tooltips, showRegisteredBy]);
}
