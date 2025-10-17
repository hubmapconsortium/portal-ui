import React from 'react';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { TutorialLandingPageContextProvider, TutorialsFilterBar, TutorialsList } from 'js/components/Tutorials';
import Description from 'js/shared-styles/sections/Description';
import TutorialsSearchBar from 'js/components/Tutorials/TutorialsSearchBar';
import { TUTORIAL_CATEGORY_DATA, TUTORIAL_CATEGORY_SECTIONS } from 'js/components/Tutorials/types';
import DetailLayout from 'js/components/detailPage/DetailLayout/DetailLayout';
import { TutorialIcon } from 'js/shared-styles/icons';

const tableOfContentsSections: Record<string, boolean> = TUTORIAL_CATEGORY_SECTIONS.reduce<Record<string, boolean>>(
  (acc, section) => {
    acc[TUTORIAL_CATEGORY_DATA[section].id] = true;
    return acc;
  },
  {} as Record<string, boolean>,
);

const trackingInfo = {
  category: 'Tutorials Landing Page',
};

function Tutorials() {
  return (
    <DetailLayout sections={tableOfContentsSections} trackingInfo={trackingInfo}>
      <Stack spacing={2} pb={2}>
        <PageTitle data-testid="tutorials-title" display="flex" flexDirection="row" alignItems="center" gap={1}>
          <TutorialIcon color="info" fontSize="2rem" />
          Tutorials
        </PageTitle>
        <Description>Step-by-step guides to HuBMAP features and workflows.</Description>
        <TutorialLandingPageContextProvider>
          <TutorialsSearchBar />
          <TutorialsFilterBar />
          <TutorialsList />
        </TutorialLandingPageContextProvider>
      </Stack>
    </DetailLayout>
  );
}

export default Tutorials;
