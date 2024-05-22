import React from 'react';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import Stack from '@mui/material/Stack';
import { useCurrentUserGlobusGroups } from './hooks';

export function ProfileGroups() {
  const currentUserGroups = useCurrentUserGlobusGroups();
  return (
    <SectionPaper>
      <Stack direction="column" spacing={1}>
        {currentUserGroups.map(({ name, description }) => (
          <LabelledSectionText key={name} label={name}>
            {description}
          </LabelledSectionText>
        ))}
      </Stack>
    </SectionPaper>
  );
}
