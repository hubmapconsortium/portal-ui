import React from 'react';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import Description from 'js/shared-styles/sections/Description';
import Paper from '@mui/material/Paper';
import { CollapsibleDetailPageSection } from '../../detailPage/DetailPageSection';
import IndexedDatasetsSummary from '../../organ/OrganCellTypes/IndexedDatasetsSummary';
import { useCellTypesDetailPageContext } from '../CellTypesDetailPageContext';
import CellTypeDistributionChart from '../../cells/CellTypeDistributionChart';
import { useIndexedDatasetsForCellTypePage } from '../hooks';
import MultiOrganCellTypeDistributionChart from './MultiOrganCellTypesDistributionChart';

function CellTypesDistributionSummary() {
  const indexedDatasetsProps = useIndexedDatasetsForCellTypePage();

  return (
    <IndexedDatasetsSummary
      {...indexedDatasetsProps}
      trackingInfo={{
        category: 'Cell Type Detail Page',
      }}
      context="Cell Type Distribution"
    >
      These results are derived from RNAseq datasets that were indexed by the scFind method to identify marker genes
      associated with the cell type. Not all HuBMAP datasets are currently compatible with this method due to
      differences in data modalities or the availability of cell annotations. This section gives a summary of the
      datasets that are used to compute these results.
    </IndexedDatasetsSummary>
  );
}

function Chart() {
  const { organs, cellTypes } = useCellTypesDetailPageContext();

  if (organs.length > 1) {
    // Stacked bar chart
    return <MultiOrganCellTypeDistributionChart organs={organs} cellTypes={cellTypes} hideLinks />;
  }
  // fraction chart
  return (
    <Paper sx={{ p: 2 }}>
      <CellTypeDistributionChart tissue={organs[0]} cellTypes={cellTypes} skipDescription />
    </Paper>
  );
}

function CellTypesDistribution() {
  const { trackingInfo } = useCellTypesDetailPageContext();
  return (
    <CollapsibleDetailPageSection
      title="Cell Type Distribution"
      id="cell-type-distribution"
      trackingInfo={trackingInfo}
    >
      <Description belowTheFold={<CellTypesDistributionSummary />}>
        This visualization displays the distribution of the cell type across the available organs, as identified by
        Azimuth and indexed by the <SCFindLink />. Only organs that contain at least one indexable dataset containing
        this cell type are included.
      </Description>
      <Chart />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesDistribution);
