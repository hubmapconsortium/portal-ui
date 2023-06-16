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

async function fetchNCBIGeneId(NCIBgeneIdURL) {
  const response = await fetch(NCIBgeneIdURL);

  if (!response.ok) {
    console.error('Gene Id API failed.', response);
  }

  const responseText = await response.text();
  const result = await parseStringPromise(responseText);
  const NCBIgeneId = result.eSearchResult.IdList[0].Id[0];
  return NCBIgeneId;
}

const useNCBIGeneId = (geneSymbol) => {
  const { data: NCBIgeneId } = useSWR(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${geneSymbol}[Preferred%20Symbol]&api_key=8ce52d016d70ec1d76542d3b87b85b2b4408`,
    fetchNCBIGeneId,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );
  return NCBIgeneId;
};

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

const useGeneData = (geneSymbol) => {
  const geneId = useNCBIGeneId(geneSymbol);

  const { data: geneData } = useSWR(
    geneId ? `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=${geneId}&retmode=xml` : null,
    fetchGeneData,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );
  return geneData;
};

async function fetchHUGOGeneId(HUGOgeneIdURL) {
  const response = await fetch(HUGOgeneIdURL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    console.error('Gene Id API failed.', response);
  }

  const responseJSON = await response.json();
  return responseJSON[1][0];
}

const useHUGOGeneId = (geneSymbol) => {
  const { data: HUGOgeneId } = useSWR(
    `https://clinicaltables.nlm.nih.gov/api/genes/v4/search?df=${geneSymbol}&terms=${geneSymbol}`,
    fetchHUGOGeneId,
    {
      fallbackData: '',
      revalidateOnFocus: false,
    },
  );
  return HUGOgeneId;
};

export { useGeneCommonName, useGeneData, useNCBIGeneId, useHUGOGeneId };
