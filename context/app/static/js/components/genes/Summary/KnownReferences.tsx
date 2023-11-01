import React from 'react';
import { useGeneDetails } from 'js/pages/Genes/hooks';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import hasKey from 'js/helpers/hasKey';
import { useGenePageContext } from '../GenePageContext';
import { ReferenceList } from './styles';

// Map reference sources to display names, default to the original source name if not found
const referenceMap = new Proxy<Record<string, string>>(
  {
    entrez: 'Entrez',
    hugo: 'HUGO HGNC',
    omim: 'OMIM',
    uniprotkb: 'UniProt',
    ensembl: 'Ensembl',
  },
  {
    get: (target: object, prop: string) => (hasKey(target, prop) ? target[prop] : String(prop)),
  },
);

function KnownReferences() {
  const { geneSymbol } = useGenePageContext();
  const { data } = useGeneDetails(geneSymbol);
  return (
    <ReferenceList>
      {data?.references?.map(({ url, source }) => (
        <dd key={source}>
          <OutboundIconLink href={url}>{referenceMap[source]}</OutboundIconLink>
        </dd>
      ))}
    </ReferenceList>
  );
}

export default KnownReferences;
