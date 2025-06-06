import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import React from 'react';
import { MolecularDataQueryFormProvider } from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryForm';
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

  const trackExploreWithMolecularAndCellularQueryTool = useTrackGeneDetailPage({
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
              href="/cells"
              variant="contained"
              color="primary"
              onClick={trackExploreWithMolecularAndCellularQueryTool}
            >
              Explore with Molecular and Cellular Query Tool
            </Button>
          </Box>
        }
      >
        These are datasets that contain this gene as identified by the <SCFindLink /> with uniformly processed HuBMAP
        RNAseq datasets. Not all HuBMAP datasets are currently compatible with this method due to data modalities or the
        availability of cell annotations. To find datasets with additional parameters such as finding datasets with
        multiple genes, use the molecular and cellular query tool.
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
