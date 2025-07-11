import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import BiomarkersSearchProvider from 'js/components/biomarkers/BiomarkersSearchContext';
import BiomarkerSearchBar from 'js/components/biomarkers/BiomarkersSearchBar';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import BiomarkersPanelList from 'js/components/biomarkers/BiomarkersPanelList';
import { InternalLink } from 'js/shared-styles/Links';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { useTrackBiomarkerLandingPage } from 'js/components/biomarkers/hooks';

export default function Biomarkers() {
  const track = useTrackBiomarkerLandingPage();
  return (
    <BiomarkersSearchProvider>
      <PanelListLandingPage
        title="Biomarkers"
        description={
          <Stack gap={1}>
            <Box>
              Gene and protein information are available in HuBMAP data. To look up information about a specific gene or
              protein, use the search bar below. Launch the <InternalLink href="/cells">Molecular Query</InternalLink>{' '}
              to find datasets for a specific biomarker.
            </Box>
            <RelevantPagesSection
              pages={[
                {
                  link: '/cells',
                  children: 'Molecular & Cellular Data Query (BETA)',
                  external: false,
                  onClick: () => {
                    track({ action: 'Select Relevant Page button', label: 'Molecular & Cellular Data Query' });
                  },
                },
              ]}
            />
          </Stack>
        }
        noIcon
        data-testid="biomarkers-title"
      >
        <BiomarkerSearchBar />
        <BiomarkersPanelList />
      </PanelListLandingPage>
    </BiomarkersSearchProvider>
  );
}
