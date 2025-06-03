import React, { useEffect } from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import { useSavedPreferences } from 'js/components/savedLists/hooks';

export function MyPreferences() {
  const { savedPreferences, handleUpdateSavedPreferences } = useSavedPreferences();
  const [enableOpenKeyNavLocal, setEnableOpenKeyNavLocal] = React.useState(savedPreferences.enableOpenKeyNav);

  useEffect(() => {
    setEnableOpenKeyNavLocal(savedPreferences.enableOpenKeyNav);
  }, [savedPreferences.enableOpenKeyNav]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    setEnableOpenKeyNavLocal(newValue);

    handleUpdateSavedPreferences({ enableOpenKeyNav: newValue }).catch((error) => {
      console.error('Failed to update preferences:', error);
      setEnableOpenKeyNavLocal(!newValue);
    });
  };

  return (
    <CollapsibleDetailPageSection id="my-preferences" title="My Preferences" component="h2" variant="h2">
      <SectionPaper>
        <LabeledPrimarySwitch
          label="Enable Open Key Nav"
          checked={Boolean(enableOpenKeyNavLocal)}
          onChange={handleChange}
        />
      </SectionPaper>
    </CollapsibleDetailPageSection>
  );
}
