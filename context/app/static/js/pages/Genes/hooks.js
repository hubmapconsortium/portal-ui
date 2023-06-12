import useSWR from 'swr';

async function fetchGeneCommonName(geneNamesURL) {
  const response = await fetch(geneNamesURL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    console.error('Genenames API failed.', response);
  }

  const results = await response.json();

  // drill down in response
  return results;
}

function useGeneCommonName(geneSymbol) {
  const { data: geneCommonName } = useSWR(
    `https://rest.genenames.org/fetch/symbol/${geneSymbol}`,
    (url) => fetchGeneCommonName(url),
    {
      fallbackData: '',
    },
  );

  return geneCommonName;
}

export { useGeneCommonName };
