import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import React from 'react';
import MolecularDataQueryForm from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryForm';
import QueryParametersFieldset from 'js/components/cells/MolecularDataQueryForm/QueryParameters';
import MolecularDataQueryFormTrackingProvider from 'js/components/cells/MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';
import { biomarkerQuery } from '../constants';
import { useGenePageContext } from '../GenePageContext';

export default function BiomarkerQuery() {
  const { geneSymbol } = useGenePageContext();

  return (
    <CollapsibleDetailPageSection
      id={biomarkerQuery.id}
      title={biomarkerQuery.title}
      iconTooltipText={biomarkerQuery.tooltip}
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
