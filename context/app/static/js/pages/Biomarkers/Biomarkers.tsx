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
import { GeneIcon } from 'js/shared-styles/icons';

export default function Biomarkers() {
  const track = useTrackBiomarkerLandingPage();
  return (
    <BiomarkersSearchProvider>
      <PanelListLandingPage
        title={
          <Stack direction="row" alignItems="center" gap={1}>
            <GeneIcon fontSize="inherit" color="primary" />
            <span>Biomarkers</span>
          </Stack>
        }
        description={
          <Stack gap={1}>
            <Box>
              Explore gene biomarker information in HuBMAP data. Search for a gene by entering its symbol below, or use
              the <InternalLink href="/search/biomarkers-cell-types">Biomarker and Cell Type Search</InternalLink> for
              advanced biomarker search options.
            </Box>
            <RelevantPagesSection
              pages={[
                {
                  link: '/search/biomarkers-cell-types',
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
