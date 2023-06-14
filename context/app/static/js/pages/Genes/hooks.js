import useSWR from 'swr';
import { parseStringPromise } from 'xml2js';

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

async function fetchGeneData(geneDataURL) {
  try {
    const response = await fetch(geneDataURL);
    const responseText = await response.text();

    const result = await parseStringPromise(responseText);
    console.log('JSON data: ', result); //eslint-disable-line
    return result;
  } catch (err) {
    console.error('There was an error: ', err);
    return null;
  }
  // const response = await fetch(geneDataURL)
  //   .then((res) => res.text())
  //   .then((responseText) => {
  //     parseString(responseText, (err, result) => {
  //       if (err) {
  //         console.error('There was an error converting XML to JSON: ', err);
  //       } else {
  //         // setJsonData(result);
  //         console.log('JSON data: ', result); //eslint-disable-line
  //         return result;
  //       }
  //     });
  //   });
  // return response;

  // if (!response.ok) {
  //   console.error('GeneData API failed.', response);
  // }

  // const results = await response.text();
  // console.log(results);      //eslint-disable-line

  // parseString(results, (err, result) => {
  //   console.log(result);      //eslint-disable-line
  // });

  // drill down in response
}

const useGeneData = (geneID) => {
  const { data: geneData } = useSWR(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=gene&id=${geneID}&retmode=xml`,
    (url) => fetchGeneData(url),
    {
      fallbackData: '',
    },
  );

  return geneData;
};

export { useGeneCommonName, useGeneData };

// https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=CD4[Preferred%20Symbol]&api_key=8ce52d016d70ec1d76542d3b87b85b2b4408
