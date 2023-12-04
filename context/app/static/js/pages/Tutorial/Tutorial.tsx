import React from 'react';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';

interface TutorialProps {
  tutorialName: 'workspaces';
}

const tutorials = {
  workspaces: {
    title: 'Navigating Workspaces',
    description:
      'Learn how to use workspaces to analyze HuBMAP data by initiating Jupyter notebooks and choosing from a variety of pre-established templates.',
    iframeLink:
      'https://app.tango.us/app/embed/bcece94f-ba05-4acb-b05b-a7d333afc583?skipCover=false&defaultListView=true&skipBranding=false',
  },
};

function Tutorial({ tutorialName }: TutorialProps) {
  const { title, description, iframeLink } = tutorials[tutorialName];
  return (
    <Stack spacing={2}>
      <PageTitle>{title}</PageTitle>
      <SectionPaper>{description}</SectionPaper>
      <iframe src={iframeLink} title={title} style={{ border: 'none', width: '100%', aspectRatio: '3 / 2' }} />
    </Stack>
  );
}

export default Tutorial;
