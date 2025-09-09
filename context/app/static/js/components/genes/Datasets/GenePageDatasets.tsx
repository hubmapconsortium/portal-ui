import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import React from 'react';
import MolecularDataQueryFormProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormProvider';
import MolecularDataQueryFormTrackingProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import SCFindGeneQueryResults from 'js/components/cells/SCFindResults/SCFindGeneQueryResults';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import Description from 'js/shared-styles/sections/Description';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { datasets } from '../constants';
import { useGeneDetailPageTrackingInfo, useGeneSymbol, useTrackGeneDetailPage } from '../hooks';

export default function Datasets() {
  const geneSymbol = useGeneSymbol();

  const trackExploreWithBiomarkerAndCellTypeSearchTool = useTrackGeneDetailPage({
    action: 'Datasets / Select "Explore with Molecular and Cellular Query" button',
  });

  return (
    <CollapsibleDetailPageSection
      id={datasets.id}
      title={`Datasets with ${geneSymbol}`}
      iconTooltipText={datasets.tooltip}
      trackingInfo={useGeneDetailPageTrackingInfo()}
    >
      <Description
        belowTheFold={
          <Box mt={2}>
            <Button
              href="/search/biomarkers-cell-types"
              variant="contained"
              color="primary"
              onClick={trackExploreWithBiomarkerAndCellTypeSearchTool}
            >
              Explore with Biomarker and Cell Type Search Tool
            </Button>
          </Box>
        }
      >
        These are datasets that contain this gene as identified by the <SCFindLink /> with uniformly processed HuBMAP
        RNAseq datasets. Not all HuBMAP datasets are currently compatible with this method due to data modalities or the
        availability of cell annotations. To find datasets with additional parameters such as finding datasets with
        multiple genes, use the Biomarker and Cell Type Search tool.
      </Description>
      <Box py={1} />
      <MolecularDataQueryFormTrackingProvider category="Gene Detail Page">
        <MolecularDataQueryFormProvider
          initialValues={{
            queryType: 'gene',
            genes: [{ full: geneSymbol, pre: '', match: geneSymbol, post: '' }],
          }}
        >
          <SelectableTableProvider tableLabel={`Datasets with ${geneSymbol} - scFind Results`}>
            <SCFindGeneQueryResults />
          </SelectableTableProvider>
        </MolecularDataQueryFormProvider>
      </MolecularDataQueryFormTrackingProvider>
    </CollapsibleDetailPageSection>
  );
}
