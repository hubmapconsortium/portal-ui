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
              Explore gene biomarker information in HuBMAP data. Search for a gene by entering its symbol below, or use
              the <InternalLink href="/search/biomarkers-celltypes">Biomarker and Cell Type Search</InternalLink> for
              advanced biomarker search options.
            </Box>
            <RelevantPagesSection
              pages={[
                {
                  link: '/search/biomarkers-celltypes',
                  children: 'Biomarker and Cell Type Search',
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
