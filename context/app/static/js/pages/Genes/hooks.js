import useSWR from 'swr';

async function fetchGeneCommonName(geneNamesURL) {
  const response = await fetch(geneNamesURL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    console.error('Genenames API failed.', response);
  }

  const results = await response.json();
  const commonName = results.response.docs[0].name;

  return commonName;
}

function useGeneCommonName(geneSymbol) {
  const { data: geneCommonName, isLoading } = useSWR(
    `https://rest.genenames.org/fetch/symbol/${geneSymbol}`,
    fetchGeneCommonName,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );

  return { geneCommonName, isLoading };
}

export { useGeneCommonName };
