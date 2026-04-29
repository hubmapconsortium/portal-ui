import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAppContext } from 'js/components/Contexts';
import { OutboundLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';

function GetAnOpenAIKey() {
  return <OutboundLink href="https://platform.openai.com/api-keys">Get an API key at OpenAI</OutboundLink>;
}

function AccessDescription() {
  const { isAuthenticated, isHuBMAPUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <Typography variant="body1">
        To use this feature, you will need your own OpenAI API key. Your key is stored locally on your browser and never
        sent anywhere else. <GetAnOpenAIKey /> or log in for other access options.
      </Typography>
    );
  }

  if (!isHuBMAPUser) {
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

export default function SaySeePanelDescription() {
  return (
    <SectionDescription>
      <Box>
        <Typography variant="body1">
          Explore public HuBMAP datasets using natural language queries and get instant visualizations. Results are
          independent from the Filter &amp; Browse Mode and do not link to individual dataset pages.{' '}
          <ContactUsLink capitalize /> to report an issue or share feedback.
        </Typography>
        <Typography variant="subtitle2">How to get access?</Typography>
        <AccessDescription />
        <Typography variant="subtitle2">Can I download my results?</Typography>
        <Typography variant="body1">
          Two types of files are available for download: a manifest file of your filtered query results and CSVs of the
          related donors, samples and datasets. To download the files contained within the datasets, use the manifest
          file with the HuBMAP CLT Tool.
        </Typography>
      </Box>
    </SectionDescription>
  );
}
