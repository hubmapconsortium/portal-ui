import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import Stack from '@mui/material/Stack';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';
import { useSavedPreferences } from 'js/components/savedLists/hooks';

const openKeyNavCommands = [
  { command: 'Shift + o', description: 'Turn OpenKeyNav on/off' },
  { command: 'k', description: 'Enter click mode to click on clickable elements, such as links' },
  { command: 's', description: 'Focus on the next scrollable region' },
  { command: 'h', description: 'Focus on the next heading' },
  { command: 'q', description: 'Alternative escape key' },
];

function OpenKeyNavSection() {
  const { savedPreferences, handleUpdateSavedPreferences } = useSavedPreferences();
  const [accordionIsOpen, setAccordionIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;

    handleUpdateSavedPreferences({ enableOpenKeyNav: newValue }).catch((error) => {
      console.error('Failed to update preferences:', error);
    });
  };

  const handleToggleAccordion = useCallback(() => {
    setAccordionIsOpen((prev) => !prev);
  }, [setAccordionIsOpen]);

  return (
    <SectionPaper>
      <Typography variant="subtitle2">OpenKeyNav | Keyboard Accessibility (BETA)</Typography>
      <Typography>
        Enable OpenKeyNav to enhance keyboard accessibility across the portal. This feature enables advanced
        keyboard-based navigation and improved focus handling for assistive technologies. Learn more at{' '}
        <OutboundIconLink href="https://openkeynav.com/">OpenKeyNav</OutboundIconLink> or read the{' '}
        <OutboundIconLink href="https://osf.io/preprints/osf/3wjsa">research preprint</OutboundIconLink>.
      </Typography>
      <LabeledPrimarySwitch
        checked={Boolean(savedPreferences.enableOpenKeyNav)}
        onChange={handleChange}
        ariaLabel="OpenKeyNav"
      />
      <DetailsAccordion
        sx={{ '.MuiAccordionSummary-root': { flexDirection: 'row' } }}
        expanded={accordionIsOpen}
        onChange={handleToggleAccordion}
        summary={
          <Typography variant="subtitle2" component="span">
            {accordionIsOpen ? 'Collapse' : 'Expand'} OpenKeyNav Commands
          </Typography>
        }
      >
        <Stack spacing={1} mt={1}>
          {openKeyNavCommands.map(({ command, description }) => (
            <Typography key="command" variant="parameters" color="secondary">
              {command} : {description}
            </Typography>
          ))}
        </Stack>
      </DetailsAccordion>
    </SectionPaper>
  );
}

export function MyPreferences() {
  return (
    <CollapsibleDetailPageSection id="my-preferences" title="My Preferences" component="h2" variant="h2">
      <OpenKeyNavSection />
    </CollapsibleDetailPageSection>
  );
}
