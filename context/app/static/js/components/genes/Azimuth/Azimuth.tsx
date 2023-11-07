import { DetailPageSection } from 'js/components/detailPage/style';
import React from 'react';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import GeneOrgans from './Organs';
import SelectedOrganContextProvider from './SelectedOrganContext';

export default function GenesAzimuth() {
  return (
    <SelectedOrganContextProvider>
      <DetailPageSection id="azimuth">
        <SectionHeader iconTooltipText="Analysis provided by Azimuth that uses an annotated reference dataset to automate the processing, analysis and interpretation of a single-cell RNA-seq experiment.">
          Azimuth Organ Reference Dataset
        </SectionHeader>
        <GeneOrgans />
      </DetailPageSection>
    </SelectedOrganContextProvider>
  );
}
