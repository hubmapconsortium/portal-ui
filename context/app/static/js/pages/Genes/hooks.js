import { useState, useEffect } from 'react';
import useSWR from 'swr';

async function fetchGeneCommonName(geneNamesURL) {
  const response = await fetch(geneNamesURL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    console.error('Genenames API failed.', response);
  }

  const results = await response.json();

  return results;
}

function useGeneCommonName(geneSymbol) {
  const [commonName, setCommonName] = useState('');

  const { data: geneCommonName } = useSWR(
    `https://rest.genenames.org/fetch/symbol/${geneSymbol}`,
    fetchGeneCommonName,
    {
      fallbackData: '',
    },
  );

  useEffect(() => {
    if (geneCommonName && geneCommonName.response && geneCommonName.response.docs[0]) {
      setCommonName(geneCommonName.response.docs[0].name);
    }
  }, [geneCommonName]);

  return commonName;
}

export { useGeneCommonName };
