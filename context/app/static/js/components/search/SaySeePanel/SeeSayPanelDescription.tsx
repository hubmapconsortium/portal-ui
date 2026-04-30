import React, { useCallback } from 'react';

import Typography from '@mui/material/Typography';
import { useAppContext } from 'js/components/Contexts';
import { OutboundLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import LabeledPrimarySwitch from 'js/shared-styles/switches/LabeledPrimarySwitch';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import { trackEvent } from 'js/helpers/trackers';
import { SaySeeDataScope, SavedPreferences } from 'js/components/savedLists/types';
import Stack from '@mui/material/Stack';

function GetAnOpenAIKey() {
  return <OutboundLink href="https://platform.openai.com/api-keys">Get an API key at OpenAI</OutboundLink>;
}

function AccessDescription() {
  const { isAuthenticated, isHubmapUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <Typography variant="body1">
        To use this feature, you will need your own OpenAI API key. Your key is stored locally on your browser and never
        sent anywhere else. <GetAnOpenAIKey /> or log in for other access options.
      </Typography>
    );
  }

  if (!isHubmapUser) {
    return (
      <Typography variant="body1">
        Your account does not currently have access to HuBMAP&apos;s AI resources. To use this feature, enter your own
        OpenAI API key below. Your key is stored locally on your browser and never sent anywhere else.{' '}
        <GetAnOpenAIKey /> or <ContactUsLink capitalize={false} /> to request access to HuBMAP&apos;s resources instead.
      </Typography>
    );
  }

  return (
    <Typography variant="body1">
      You have access to HuBMAP&apos;s AI resources. If you run out of free tokens during a session, you can enter your
      own OpenAI API key to continue. Your key is stored locally on your browser and never sent anywhere else.{' '}
      <GetAnOpenAIKey />.
    </Typography>
  );
}

function DataScopeSwitch() {
  const { savedPreferences: rawPrefs, handleUpdateSavedPreferences } = useSavedPreferences();
  const savedPreferences = rawPrefs as SavedPreferences;
  const scope: SaySeeDataScope = savedPreferences?.saySeeDataScope ?? 'public';

  const handleChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const next: SaySeeDataScope = checked ? 'authenticated' : 'public';
      trackEvent({
        category: 'Say & See',
        action: 'Toggle Data Scope',
        label: next,
      });
      void handleUpdateSavedPreferences({ ...savedPreferences, saySeeDataScope: next });
    },
    [handleUpdateSavedPreferences, savedPreferences],
  );

  return (
    <div>
      <Typography variant="subtitle1">Data scope</Typography>
      <Typography variant="body1" gutterBottom>
        By default, Say &amp; See uses a fast, shared cache of HuBMAP&apos;s public index. Switch to your authenticated
        view to query any non-public datasets your account can access — this skips the shared cache and may take longer
        to load.
      </Typography>
      <LabeledPrimarySwitch
        label="Use my full HuBMAP access"
        labelVariant="subtitle1"
        ariaLabel="Toggle whether Say & See uses public data or your authenticated HuBMAP access"
        disabledLabel="Published data (faster)"
        enabledLabel="All available data (slower)"
        tooltip="Published data is much faster to load, but excludes any non-public datasets your account can access. Toggle on to fetch the authenticated view, which is slower because it skips the shared cache and reflects your individual level of access."
        checked={scope === 'authenticated'}
        onChange={handleChange}
      />
    </div>
  );
}

function DataScopeSection() {
  const { isAuthenticated, isHubmapUser } = useAppContext();
  if (!isAuthenticated || !isHubmapUser) return null;
  return <DataScopeSwitch />;
}

export default function SaySeePanelDescription() {
  return (
    <SectionDescription>
      <Stack spacing={1}>
        <Typography variant="body1">
          Explore public HuBMAP datasets using natural language queries and get instant visualizations. Results are
          independent from the Filter &amp; Browse Mode and do not link to individual dataset pages.{' '}
          <ContactUsLink capitalize /> to report an issue or share feedback.
        </Typography>
        <div>
          <Typography variant="subtitle1">How to get access?</Typography>
          <AccessDescription />
        </div>
        <div>
          <Typography variant="subtitle1">Can I download my results?</Typography>
          <Typography variant="body1">
            Two types of files are available for download: a manifest file of your filtered query results and CSVs of
            the related donors, samples and datasets. To download the files contained within the datasets, use the
            manifest file with the HuBMAP CLT Tool.
          </Typography>
        </div>
        <DataScopeSection />
      </Stack>
    </SectionDescription>
  );
}
