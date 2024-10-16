import React from 'react';

import Description from 'js/components/biomarkers/Description';
import BiomarkersSearchProvider from 'js/components/biomarkers/BiomarkersSearchContext';
import BiomarkerSearchBar from 'js/components/biomarkers/BiomarkersSearchBar';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import BiomarkersPanelList from 'js/components/biomarkers/BiomarkersPanelList';

export default function Biomarkers() {
  return (
    <BiomarkersSearchProvider>
      <PanelListLandingPage title="Biomarkers" description={<Description />} noIcon dataTestId="biomarkers-title">
        <BiomarkerSearchBar />
        <BiomarkersPanelList />
      </PanelListLandingPage>
    </BiomarkersSearchProvider>
  );
}
