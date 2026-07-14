import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import React from 'react';
import MolecularDataQueryFormProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormProvider';
import MolecularDataQueryFormTrackingProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import Description from 'js/shared-styles/sections/Description';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { datasets } from '../constants';
import { useGeneDatasetsData, useGeneDetailPageTrackingInfo, useGeneSymbol, useTrackGeneDetailPage } from '../hooks';
import GeneDatasetsResults from './GeneDatasetsResults';
import { useGeneMatchedDatasets } from './hooks';

export default function Datasets() {
  const geneSymbol = useGeneSymbol();
  const trackingInfo = useGeneDetailPageTrackingInfo();

  const { data: rnaData, isLoading } = useGeneDatasetsData(undefined);
  const { data: atacData } = useGeneDatasetsData('ATAC');
  const rna = useGeneMatchedDatasets(rnaData);
  const atac = useGeneMatchedDatasets(atacData);
  const hasNoDatasets = !isLoading && rna.ids.length === 0 && atac.ids.length === 0;

  const trackExploreWithBiomarkerAndCellTypeSearchTool = useTrackGeneDetailPage({
    action: 'Datasets / Select "Explore with Molecular and Cellular Query" button',
  });

  if (hasNoDatasets) {
    return (
      <CollapsibleDetailPageSection id={datasets.id} title={`Datasets with ${geneSymbol}`} trackingInfo={trackingInfo}>
        <Description>
          No datasets containing this gene were identified by the <SCFindLink /> within uniformly processed HuBMAP
          RNAseq or ATACseq datasets.
        </Description>
      </CollapsibleDetailPageSection>
    );
  }

  return (
    <CollapsibleDetailPageSection id={datasets.id} title={`Datasets with ${geneSymbol}`} trackingInfo={trackingInfo}>
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
        RNAseq or ATACseq datasets. Not all HuBMAP datasets are currently compatible with this method due to data
        modalities or the availability of cell annotations. To find datasets with additional parameters such as finding
        datasets with multiple genes, use the biomarker and cell type search tool.
      </Description>
      <Box py={1} />
      <MolecularDataQueryFormTrackingProvider category="Gene Detail Page">
        <MolecularDataQueryFormProvider
          initialValues={{
            queryType: 'gene',
            genes: [{ full: geneSymbol, pre: '', match: geneSymbol, post: '' }],
          }}
        >
          {/* Selection is scoped per results tab inside GeneDatasetsResults, so no provider here. */}
          <GeneDatasetsResults />
        </MolecularDataQueryFormProvider>
      </MolecularDataQueryFormTrackingProvider>
    </CollapsibleDetailPageSection>
  );
}
