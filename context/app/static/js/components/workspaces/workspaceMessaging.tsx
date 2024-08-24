import React, { PropsWithChildren, useState } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { Alert } from 'js/shared-styles/alerts';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';
import { InternalLink } from 'js/shared-styles/Links';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { InfoIcon } from 'js/shared-styles/icons';
import { useSelectItems } from 'js/hooks/useSelectItems';

import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import TemplateGrid from './TemplateGrid';
import { useWorkspaceTemplates } from './NewWorkspaceDialog/hooks';
import { LoginButton } from '../detailPage/BulkDataTransfer/style';
import TemplateTagsAutocomplete from './TemplateTagsAutocomplete/TemplateTagsAutocomplete';

function ContactUsForAccess() {
  return (
    <>
      <ContactUsLink>Contact us</ContactUsLink> for questions about access.
    </>
  );
}

const workspacesDescription = {
  title: 'What are workspaces?',
  body: 'Workspaces enable lightweight exploration of public HuBMAP data and user-provided data using Python and R in a Jupyter Lab environment hosted by HuBMAP at no cost to community members.',
};

const workspacesUsage = {
  title: 'How do I use workspaces?',
  body: (
    <>
      Explore more about this platform through our{' '}
      <InternalLink href="/tutorials/workspaces">workspace tutorials</InternalLink> to optimize your experience with
      workspaces. To begin a new workspace, find datasets on our{' '}
      <InternalLink href="/search?entity_type[0]=Dataset">search page</InternalLink> and launch a workspace from them.
      To learn more about getting started, explore <InternalLink href="/templates">workspace templates</InternalLink> to
      help you start analyzing HuBMAP data.
    </>
  ),
};

const workspacesSupportInfo = {
  title: 'What do workspaces currently support?',
  body: 'Workspaces launch with Python support by default, with the option to add support for R upon launch. Please note that workspaces with added R support may experience longer load times.',
};

const workspacesQuestionsSuggestions = {
  title: 'Questions/Suggestions',
  body: (
    <>
      Please be aware that certain limitations currently exist on this platform due to its simplified exploration
      design. If you have any questions or suggestions about workspaces, contact us through the{' '}
      <ContactUsLink> HuBMAP Help Desk. </ContactUsLink>
    </>
  ),
};

const text = {
  unauthenticated: [workspacesDescription, workspacesUsage, workspacesSupportInfo, workspacesQuestionsSuggestions],
  noAccess: [
    workspacesDescription,
    {
      title: 'How do I get access to workspaces as a HuBMAP member?',
      body: (
        <>
          Log into the <OutboundIconLink href="https://hubmapconsortium.org">consortium website</OutboundIconLink>. Go
          to Member Services {'>'} My Profile. On the profile update page, request access to: “HuBMAP Data Via Globus”
          and “HuBMAP Slack Workspace”. Allow up to 2 days to process your request. Once approved, you will receive a
          ticket sent to your email confirming your access. <ContactUsForAccess />
        </>
      ),
    },
  ],
  access: [workspacesDescription, workspacesUsage, workspacesSupportInfo, workspacesQuestionsSuggestions],
};

const pageLinks = [
  {
    link: '/tutorials/workspaces',
    children: 'Tutorials',
  },
  {
    link: '/templates',
    children: 'Templates',
  },
  {
    link: '/search?entity_type[0]=Dataset',
    children: 'Dataset Search Page',
  },
];

function LogInAlert() {
  return <LoginAlert featureName="workspaces" />;
}

function AccessAlert() {
  return (
    <Alert severity="info">
      You do not have access to workspaces. Access to workspaces is restricted to HuBMAP members at present. If you are
      a HuBMAP member, follow the instructions below to gain access. <ContactUsForAccess />
    </Alert>
  );
}

function TemplateGridPreview() {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

  const recommendedTags = ['visualization', 'api'];

  return (
    <Stack pt={2} spacing={2}>
      <Typography component="h3" variant="h4">
        Workspace Templates
      </Typography>
      <Stack component={Paper} p={2} spacing={2}>
        <Stack direction="row" spacing={2}>
          <InfoIcon color="primary" fontSize="1.5rem" />
          <Typography>
            Explore workspace templates designed to help you start analyzing HuBMAP data. Use tags to filter templates
            by your specific interests. Click on any template for detailed information.{' '}
            <InternalLink href="/login">Log in</InternalLink> to begin working in a workspace.
          </Typography>
        </Stack>
        <Box>
          <LoginButton href="/login" variant="contained" color="primary">
            Log In
          </LoginButton>
        </Box>
      </Stack>
      <Stack spacing={2}>
        <TemplateTagsAutocomplete
          selectedTags={selectedTags}
          recommendedTags={recommendedTags}
          toggleTag={toggleTag}
          setSelectedTags={setSelectedTags}
          selectedRecommendedTags={selectedRecommendedTags}
        />
        <TemplateGrid templates={templates} />
      </Stack>
    </Stack>
  );
}

function TextItems({ textKey, children }: PropsWithChildren<{ textKey: keyof typeof text }>) {
  return (
    <Stack>
      <Stack component={Paper} p={2} spacing={2}>
        {children}
        <Stack spacing={1}>
          {text[textKey].map(({ title, body }) => (
            <LabelledSectionText label={title} key={title} spacing={1}>
              {body}
            </LabelledSectionText>
          ))}
          <LabelledSectionText label="Relevant Pages" spacing={1}>
            <Stack direction="row" spacing={1}>
              {pageLinks.map((page) => (
                <OutlinedLinkButton key={page.link} {...page} />
              ))}
            </Stack>
          </LabelledSectionText>
        </Stack>
      </Stack>
      {!isAuthenticated && <TemplateGridPreview />}
    </Stack>
  );
}

export { LogInAlert, AccessAlert, TextItems };
