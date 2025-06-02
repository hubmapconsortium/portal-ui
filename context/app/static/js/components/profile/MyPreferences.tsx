import React, { useState } from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';

export function MyPreferences() {
  const [checked, setChecked] = useState(true);

  const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, value: boolean) => {
    setChecked(value);
  };

  return (
    <CollapsibleDetailPageSection id="my-preferences" title="My Preferences" component="h2" variant="h2">
      <SectionPaper>
        <LabeledPrimarySwitch label="Enable Open Key Nav" checked={checked} onChange={handleChange} />
      </SectionPaper>
    </CollapsibleDetailPageSection>
  );
}
