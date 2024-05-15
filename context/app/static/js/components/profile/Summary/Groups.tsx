import React from 'react';
import { readCookie } from 'js/helpers/functions';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Stack } from '@mui/material';
import { useAppContext } from '../../Contexts';
import { useGlobusGroups } from './hooks';

export function ProfileGroups() {
  const { isAuthenticated } = useAppContext();
  const groupsCookie = readCookie('user_groups');
  const { data: allGlobusGroups = [] } = useGlobusGroups();
  if (!groupsCookie || !isAuthenticated) {
    return null;
  }

  const groups = groupsCookie.split('|');

  const currentUserGroups = allGlobusGroups
    ?.filter((group) => groups.includes(group.name))
    .map((g) => ({
      key: g.name,
      name: g.displayname,
      description: g.description,
    }));

  const nonHubmapGroups = groups.filter((group) => !currentUserGroups.find((g) => g.key === group));

  return (
    <SectionPaper>
      <Stack direction="column" spacing={1}>
        {currentUserGroups.map(({ name, description }) => (
          <LabelledSectionText key={name} label={name}>
            {description}
          </LabelledSectionText>
        ))}
        {nonHubmapGroups.length > 0 && (
          <LabelledSectionText label="Other Groups">{nonHubmapGroups.join(', ')}</LabelledSectionText>
        )}
      </Stack>
    </SectionPaper>
  );
}
