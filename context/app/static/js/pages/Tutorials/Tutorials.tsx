import React from 'react';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';
import { TutorialLandingPageContextProvider, TutorialsFilterBar, TutorialsList } from 'js/components/Tutorials';
import Description from 'js/shared-styles/sections/Description';
import TutorialsSearchBar from 'js/components/Tutorials/TutorialsSearchBar';

function Tutorials() {
  return (
    <Stack spacing={2} pb={2}>
      <PageTitle data-testid="tutorials-title" display="flex" flexDirection="row" alignItems="center" gap={1}>
        <MenuBookRounded color="info" fontSize="large" />
        Tutorials
      </PageTitle>
      <Description>Step-by-step guides to HuBMAP features and workflows.</Description>
      <TutorialLandingPageContextProvider>
        <TutorialsSearchBar />
        <TutorialsFilterBar />
        <TutorialsList />
      </TutorialLandingPageContextProvider>
    </Stack>
  );
}

export default Tutorials;
