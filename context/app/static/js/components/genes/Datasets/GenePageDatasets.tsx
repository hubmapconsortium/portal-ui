import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import React from 'react';
import MolecularDataQueryForm from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryForm';
import QueryParametersFieldset from 'js/components/cells/MolecularDataQueryForm/QueryParameters';
import MolecularDataQueryFormTrackingProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { datasets } from '../constants';
import { useGenePageContext } from '../GenePageContext';

export default function Datasets() {
  const { geneSymbol, geneSymbolUpper } = useGenePageContext();

  return (
    <CollapsibleDetailPageSection
      id={datasets.id}
      title={`Datasets with ${geneSymbolUpper}`}
      iconTooltipText={datasets.tooltip}
    >
      <MolecularDataQueryFormTrackingProvider category={`Gene Detail Page ${geneSymbol}`}>
        <MolecularDataQueryForm
          initialValues={{
            queryType: 'gene',
            genes: [{ full: geneSymbol, pre: '', match: geneSymbol, post: '' }],
          }}
        >
          <QueryParametersFieldset defaultValue={geneSymbol} />
        </MolecularDataQueryForm>
      </MolecularDataQueryFormTrackingProvider>
    </CollapsibleDetailPageSection>
  );
}
