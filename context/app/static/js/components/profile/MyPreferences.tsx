import React from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import { useSavedPreferences } from 'js/components/savedLists/hooks';

export function MyPreferences() {
  const { savedPreferences, handleUpdateSavedPreferences } = useSavedPreferences();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    handleUpdateSavedPreferences({ enableOpenKeyNav: newValue }).catch((error) => {
      console.error('Failed to update preferences:', error);
    });
  };

  return (
    <CollapsibleDetailPageSection id="my-preferences" title="My Preferences" component="h2" variant="h2">
      <SectionPaper>
        <LabeledPrimarySwitch
          label="Enable Open Key Nav"
          checked={Boolean(savedPreferences.enableOpenKeyNav)}
          onChange={handleChange}
        />
      </SectionPaper>
    </CollapsibleDetailPageSection>
  );
}
