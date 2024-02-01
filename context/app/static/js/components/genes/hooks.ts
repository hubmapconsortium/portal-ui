import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import { useFeatureDetails } from 'js/hooks/useCrossModalityApi';
import { useGenePageContext } from './GenePageContext';

const useGeneOntology = () => {
  const { geneSymbol } = useGenePageContext();
  return useGeneOntologyDetail(geneSymbol);
};

const useGeneEntities = () => {
  const { geneSymbol } = useGenePageContext();
  return useFeatureDetails('genes', geneSymbol);
};

export { useGeneOntology, useGeneEntities, useGenePageContext };
