import React, { useCallback, useState } from 'react';
import Typography from '@mui/material/Typography';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import useOpenKeyNavStore, { deleteOpenKeyNavCookie, readOpenKeyNavCookie } from 'js/stores/useOpenKeyNavStore';
import useThemePreferenceStore, { type ThemePreference } from 'js/stores/useThemePreferenceStore';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import { LabeledPrimarySwitch } from 'js/shared-styles/switches';

function buildOnCommand() {
  const { userAgent } = window.navigator;
  if (userAgent.includes('Mac')) {
    return 'Command ⌘ + /';
  }

  if (userAgent.includes('Win')) {
    return 'Windows ⊞ + /';
  }

  return 'Meta + /';
}

const openKeyNavCommands = [
  { command: buildOnCommand(), description: 'Turn OpenKeyNav on/off' },
  { command: 'k', description: 'Enter click mode to click on clickable elements, such as links' },
  { command: 's', description: 'Focus on the next scrollable region' },
  { command: 'h', description: 'Focus on the next heading' },
  { command: 'q', description: 'Alternative escape key' },
];

function OpenKeyNavSection() {
  const hasOpenKeyNavCookie = readOpenKeyNavCookie();

  const initialize = useOpenKeyNavStore((s) => s.initialize);
  const setInitialize = useOpenKeyNavStore((s) => s.setInitialize);

  const [accordionIsOpen, setAccordionIsOpen] = useState(hasOpenKeyNavCookie);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialize(!initialize);
    if (!e.target.checked) {
      deleteOpenKeyNavCookie();
      window.location.reload();
    }

    if (e.target.checked && !accordionIsOpen) {
      setAccordionIsOpen(true);
    }
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
        checked={initialize}
        onChange={handleChange}
        ariaLabel="OpenKeyNav"
        sx={{
          '&:focus-within': {
            '.MuiSwitch-root': { outline: '2px solid', outlineColor: 'primary.main' },
          },
        }}
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
        <Stack
          spacing={1}
          sx={{
            mt: 1,
          }}
        >
          {openKeyNavCommands.map(({ command, description }) => (
            <Typography key={command} variant="parameters" color="secondary">
              {command} : {description}
            </Typography>
          ))}
        </Stack>
      </DetailsAccordion>
    </SectionPaper>
  );
}

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function ThemeSection() {
  const preference = useThemePreferenceStore((s) => s.preference);
  const setPreference = useThemePreferenceStore((s) => s.setPreference);

  return (
    <SectionPaper>
      <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="subtitle2">Dark Mode (BETA)</Typography>
        <Typography>
          Choose a light or dark theme for the portal, or match your device&apos;s setting. Dark mode is in beta, so
          some pages and visualizations may not display it fully yet.
        </Typography>
        <ToggleButtonGroup
          value={preference}
          exclusive
          size="small"
          color="primary"
          aria-label="Portal theme"
          onChange={(_, value: ThemePreference | null) => {
            // No value means the user clicked the already active option.
            if (value) {
              setPreference(value);
            }
          }}
        >
          {themeOptions.map(({ value, label }) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </SectionPaper>
  );
}

export function MyPreferences() {
  return (
    <CollapsibleDetailPageSection id="my-preferences" title="My Preferences" component="h2" variant="h2">
      <Stack spacing={2}>
        <ThemeSection />
        <OpenKeyNavSection />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}
