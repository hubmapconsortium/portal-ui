import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import hasKey from 'js/helpers/hasKey';
import { capitalizeString } from 'js/helpers/functions';

import { trackEvent } from 'js/helpers/trackers';
import { useGeneOntology, useGenePageContext } from '../hooks';
import { ReferenceList } from './styles';

// Map reference sources to display names
// default to capitalizing the original source name if not found
const referenceMap = new Proxy<Record<string, string>>(
  {
    entrez: 'Entrez',
    hugo: 'HUGO HGNC',
    omim: 'OMIM',
    uniprotkb: 'UniProt',
    ensembl: 'Ensembl',
  },
  {
    get: (target: object, prop: string) => (hasKey(target, prop) ? target[prop] : capitalizeString(prop)),
  },
);

function ReferenceListContents() {
  const { data } = useGeneOntology();
  const { geneSymbolUpper } = useGenePageContext();

  const trackReferenceLinkClick = (source: string) => () => {
    trackEvent({
      category: 'Gene Detail Page',
      action: 'Summary / Select Known References',
      label: `${data?.approved_symbol ?? geneSymbolUpper} ${source}`,
    });
  };
  if (!data) {
    return (
      <>
        <Skeleton width={100} />
        <Skeleton width={120} />
        <Skeleton width={80} />
      </>
    );
  }

  return (
    <>
      {data.references.map(({ url, source }) => (
        <li key={source}>
          <OutboundIconLink onClick={trackReferenceLinkClick(referenceMap[source])} href={url}>
            {referenceMap[source]}
          </OutboundIconLink>
        </li>
      ))}
    </>
  );
}

function KnownReferences() {
  return (
    <ReferenceList>
      <ReferenceListContents />
    </ReferenceList>
  );
}

export default KnownReferences;
