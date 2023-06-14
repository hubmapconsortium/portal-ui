import useSWR from 'swr';
import { parseStringPromise } from 'xml2js';

async function fetchGeneCommonName(geneNamesURL) {
  const response = await fetch(geneNamesURL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    console.error('Gene name API failed.', response);
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

async function fetchGeneData(geneDataURL) {
  const response = await fetch(geneDataURL);

  if (!response.ok) {
    console.error('Gene data API failed.', response);
  }

  const responseText = await response.text();
  const result = await parseStringPromise(responseText);
  const geneSummary = result['Entrezgene-Set'].Entrezgene[0].Entrezgene_summary[0];
  return geneSummary;
}

const useGeneData = (geneID) => {
  const { data: geneData } = useSWR(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=${geneID}&retmode=xml`,
    fetchGeneData,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );

  return geneData;
};

async function fetchGeneId(geneIdURL) {
  const response = await fetch(geneIdURL);

  if (!response.ok) {
    console.error('Gene Id API failed.', response);
  }

  const responseText = await response.text();
  const result = await parseStringPromise(responseText);
  const geneId = result.eSearchResult.IdList[0].Id[0];
  return geneId;
}

const useGeneId = (geneSymbol) => {
  const { data: geneId } = useSWR(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${geneSymbol}[Preferred%20Symbol]&api_key=8ce52d016d70ec1d76542d3b87b85b2b4408`,
    fetchGeneId,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );
  return geneId;
};

export { useGeneCommonName, useGeneData, useGeneId };

// https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=CD4[Preferred%20Symbol]&api_key=8ce52d016d70ec1d76542d3b87b85b2b4408
