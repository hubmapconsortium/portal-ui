import React, { PropsWithChildren, useState } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { Alert } from 'js/shared-styles/alerts';
import LoginAlert from 'js/shared-styles/alerts/LoginAlert';
import { InternalLink } from 'js/shared-styles/Links';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import OutlinedLinkButton from 'js/shared-styles/buttons/OutlinedLinkButton';
import LogInPanel from 'js/shared-styles/panels/LogInPanel';
import { useSelectItems } from 'js/hooks/useSelectItems';

import { trackEvent } from 'js/helpers/trackers';
import TemplateGrid from './TemplateGrid';
import { useWorkspaceTemplates } from './NewWorkspaceDialog/hooks';
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
      <InternalLink
        href="/tutorials/workspaces"
        onClick={() =>
          trackEvent({
            category: 'Workspace Landing Page',
            action: 'Navigate to Workspace Tutorial',
          })
        }
      >
        workspace tutorials
      </InternalLink>{' '}
      to optimize your experience with workspaces. To begin a new workspace, find datasets on our{' '}
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
  workspacesUserOrLoggedOut: [
    workspacesDescription,
    workspacesUsage,
    workspacesSupportInfo,
    workspacesQuestionsSuggestions,
  ],
  nonWorkspacesUser: [
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
    workspacesUsage,
    workspacesSupportInfo,
  ],
};

const trackRelevantPage = (pageName: string) => {
  trackEvent({
    category: 'Workspace Landing Page',
    action: 'Navigate to Relevant Page',
    value: pageName,
  });
};

const pageLinks = [
  {
    onClick: () => trackRelevantPage('Tutorials'),
    link: '/tutorials/workspaces',
    children: 'Tutorials',
  },
  {
    onClick: () => trackRelevantPage('Templates'),
    link: '/templates',
    children: 'Templates',
  },
  {
    onClick: () => trackRelevantPage('Dataset Search Page'),
    link: '/search?entity_type[0]=Dataset',
    children: 'Dataset Search Page',
  },
];

function WorkspacesLogInAlert() {
  return (
    <LoginAlert
      featureName="workspaces"
      onClick={() =>
        trackEvent({
          category: 'Workspace Landing Page',
          action: 'Log In / From alert',
        })
      }
    />
  );
}

function AccessAlert() {
  return (
    <Alert severity="info">
      You do not have access to workspaces. Access to workspaces is restricted to HuBMAP members at present. If you are
      a HuBMAP member, follow the instructions below to gain access. <ContactUsForAccess />
    </Alert>
  );
}

interface EventTrackingProps {
  trackingCategory: string;
}

function TemplatePreviewSection({ trackingCategory }: EventTrackingProps) {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

  const recommendedTags = ['visualization', 'api'];

  const trackLogIn = () => {
    trackEvent({
      category: trackingCategory,
      action: 'Log In / From template section',
    });
  };

  return (
    <Stack spacing={3}>
      <LogInPanel onClick={trackLogIn}>
        Explore workspace templates designed to help you start analyzing HuBMAP data. Use tags to filter templates by
        your specific interests. Click on any template for detailed information.{' '}
        <InternalLink onClick={trackLogIn} href="/login">
          Log in
        </InternalLink>{' '}
        to begin working in a workspace.
      </LogInPanel>
      <Stack spacing={2}>
        <TemplateTagsAutocomplete
          selectedTags={selectedTags}
          recommendedTags={recommendedTags}
          toggleTag={toggleTag}
          setSelectedTags={setSelectedTags}
          selectedRecommendedTags={selectedRecommendedTags}
          onSelectTag={(tag) =>
            trackEvent({
              category: trackingCategory,
              action: 'Select Template Tag from Dropdown',
              value: tag,
            })
          }
          onSelectRecommendedTag={(tag) =>
            trackEvent({
              category: trackingCategory,
              action: 'Select Recommended Template Tag',
              value: tag,
            })
          }
        />
        <TemplateGrid
          templates={templates}
          onClick={(templateName: string) =>
            trackEvent({
              category: trackingCategory,
              action: 'Click template card',
              value: templateName,
            })
          }
        />
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
      {!isAuthenticated && (
        <Stack pt={2} spacing={2}>
          <Typography variant="h4">Workspace Templates</Typography>
          <TemplatePreviewSection trackingCategory="Workspace Landing Page" />
        </Stack>
      )}
    </Stack>
  );
}

export { WorkspacesLogInAlert, AccessAlert, TemplatePreviewSection, TextItems };
