import React, { PropsWithChildren, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { useAppContext } from 'js/components/Contexts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { Alert } from 'js/shared-styles/alerts';
import { InternalLink } from 'js/shared-styles/Links';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function ContactUsForAccess() {
  return (
    <>
      <ContactUsLink>Contact us</ContactUsLink> for questions about access.
    </>
  );
}

const workspacesDescription = {
  title: 'What are workspaces?',
  body: 'Workspaces provides a lightweight exploration platform tailored for researchers to easily access HuBMAP data and perform analyses directly within the portal. Effortlessly upload dataset files to a Jupyter notebook using provided templates to get started on analyzing HuBMAP data. ',
};

const text = {
  unauthenticated: [workspacesDescription],
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
  access: [
    workspacesDescription,
    {
      title: 'How do I use workspaces?',
      body: (
        <>
          Explore more about this platform through our{' '}
          <InternalLink href="/tutorials/workspaces">workspace tutorials</InternalLink> to optimize your experience with
          workspaces. To begin a new workspace, find datasets on our{' '}
          <InternalLink href="/search?entity_type[0]=Dataset">search page</InternalLink> and launch a workspace from
          them.
        </>
      ),
    },
    {
      title: 'What do workspaces currently support?',
      body: 'Workspaces launch with Python support by default, with the option to add support for R upon launch. Please note that workspaces with added R support may experience longer load times.',
    },
    {
      title: 'Questions/Suggestions',
      body: (
        <>
          Please be aware that certain limitations currently exist on this platform due to its simplified exploration
          design. If you have any questions or suggestions about workspaces, submit feedback at the HuBMAP{' '}
          <InternalLink href="https://hubmapconsortium.slack.com/archives/C056RMNB1C6">
            #workspaces-feedback
          </InternalLink>{' '}
          Slack channel, or <ContactUsLink /> through the help desk.
        </>
      ),
    },
  ],
};

function TextItem({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography>{children}</Typography>
    </Stack>
  );
}

function TextItems({ textKey, children }: PropsWithChildren<{ textKey: keyof typeof text }>) {
  return (
    <Stack component={Paper} p={2} spacing={2}>
      {children}
      <Stack spacing={1}>
        {text[textKey].map(({ title, body }) => (
          <TextItem title={title} key={title}>
            {body}
          </TextItem>
        ))}
      </Stack>
    </Stack>
  );
}

function LogInAlert() {
  return (
    <Alert severity="info" action={<Button href="/login">Log in</Button>}>
      You must be logged in to access workspaces. Access to workspaces is restricted to HuBMAP members at present.
    </Alert>
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

function WorkspacesAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <TextItems textKey="unauthenticated">
        <LogInAlert />
      </TextItems>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <TextItems textKey="noAccess">
        <AccessAlert />
      </TextItems>
    );
  }

  return (
    <>
      <TextItems textKey="access" />
      {children}
    </>
  );
}

export default WorkspacesAuthGuard;
