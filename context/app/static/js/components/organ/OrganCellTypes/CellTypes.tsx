import React, { useEffect } from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import { Tab, TabPanel, Tabs, useTabs } from 'js/shared-styles/tabs';
import OrganDetailSection from '../OrganDetailSection';
import CellTypesTable from './CellTypesTable';
import OrganCellTypesProvider, { useOrganCellTypesByModality } from './OrganCellTypesContext';

function CellTypesSection() {
  const { openTabIndex, handleTabChange, setOpenTabIndex } = useTabs();
  // Counts for the tab labels come from the aggregate's per-modality cell-type lists.
  const rnaCount = useOrganCellTypesByModality(undefined).cellTypes.length;
  const atacCount = useOrganCellTypesByModality('ATAC').cellTypes.length;

  // Default to the ATACseq tab when an organ has no RNAseq cell types (the RNAseq tab is disabled).
  useEffect(() => {
    if (rnaCount === 0 && atacCount > 0) {
      setOpenTabIndex(1);
    }
  }, [rnaCount, atacCount, setOpenTabIndex]);

  return (
    <OrganDetailSection title="Cell Types" id="cell-types">
      <Description>
        These results are derived from RNAseq and ATACseq datasets that were indexed by the <SCFindLink /> to identify
        the cell types associated with this organ. Not all HuBMAP datasets are currently compatible with this method due
        to differences in data modalities or the availability of cell annotations. This section gives a summary of the
        datasets that are used to compute these results, and only datasets from this organ are included.
      </Description>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab label={`RNAseq (${rnaCount} Cell Types)`} index={0} disabled={rnaCount === 0} />
        <Tab label={`ATACseq (${atacCount} Cell Types)`} index={1} disabled={atacCount === 0} />
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <CellTypesTable modality={undefined} />
      </TabPanel>
      <TabPanel value={openTabIndex} index={1}>
        <CellTypesTable modality="ATAC" />
      </TabPanel>
    </OrganDetailSection>
  );
}

function CellTypes() {
  return (
    <OrganCellTypesProvider>
      <CellTypesSection />
    </OrganCellTypesProvider>
  );
}

export default withShouldDisplay(CellTypes);
