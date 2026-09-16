import useSWR from 'swr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGenePathways } from 'js/hooks/useUBKG';
import { fetcher } from 'js/helpers/swr';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import type { AutocompleteQueryKey, AutocompleteQueryResponse, AutocompleteResult } from './types';
import { getScFindModality, useMolecularDataQueryFormState } from '../hooks';

interface ScFindAutocompleteResponse {
  results?: AutocompleteResult[];
  error?: string;
}

const fetchEntityAutocomplete = async ({
  targetEntity,
  substring,
  queryMethod,
}: AutocompleteQueryKey): Promise<AutocompleteQueryResponse> => {
  if (!substring) {
    return [];
  }

  const urlParams = new URLSearchParams();
  urlParams.append('q', substring);
  urlParams.append('limit', '10');
  const modality = getScFindModality(queryMethod);
  if (modality) {
    urlParams.append('modality', modality);
  }

  // The backend handles organ grouping and tags for cell types, so results are returned as-is.
  const feature = targetEntity === 'gene' ? 'genes' : 'cell-types';
  const responseJson = await fetcher<ScFindAutocompleteResponse>({
    url: `/scfind/${feature}/autocomplete?${urlParams.toString()}`,
  });

  return responseJson.results ?? [];
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  return useSWR(queryKey, fetchEntityAutocomplete);
}

export function usePathwayAutocompleteQuery(substring: string) {
  const { data: pathways, isLoading } = useGenePathways({
    // Since the initial response contains all the pathways, filtering locally
    // is more efficient than waiting for the server to filter them
    // and then sending the filtered list back to the client.
    // pathwayNameStartsWith: substring,
  });

  const options: AutocompleteResult[] = useMemo(() => {
    if (!pathways) {
      return [];
    }
    return pathways.events
      .filter((pathway) => pathway.description.toLowerCase().includes(substring.toLowerCase()))
      .sort((a, b) => a.description.localeCompare(b.description))
      .map((pathway) => {
        const matchIndex = pathway.description.toLowerCase().indexOf(substring.toLowerCase());
        return {
          full: `${pathway.description} (${pathway.code})`,
          pre: pathway.description.slice(0, matchIndex),
          match: pathway.description.slice(matchIndex, matchIndex + substring.length),
          post: pathway.description.slice(matchIndex + substring.length),
          tags: [pathway.code],
          values: [pathway.code],
        };
      });
  }, [pathways, substring]);

  return { pathways, options, isLoading };
}

interface PathwayGenesResponse {
  valid_genes: string[];
  invalid_genes: string[];
  total_genes: number;
  total_valid: number;
  error?: string;
}

/**
 * Fetches pathway genes from the backend, which resolves pathway participants from UBKG
 * and validates them against the scFind gene list for the given modality.
 * This collapses 2 network requests (UBKG fetch + scFind validate) into 1.
 */
async function fetchScFindPathwayGenes(
  pathwayCode: string,
  queryMethod: string,
  abortSignal?: AbortSignal,
): Promise<{ validGenes: string[]; invalidGenes: string[] }> {
  const modality = getScFindModality(queryMethod);
  const requestBody: { pathway_code: string; modality?: string } = { pathway_code: pathwayCode };
  if (modality) {
    requestBody.modality = modality;
  }

  const result = await fetcher<PathwayGenesResponse>({
    url: '/scfind/pathway-genes',
    requestInit: {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
      signal: abortSignal,
    },
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return {
    validGenes: result.valid_genes,
    invalidGenes: result.invalid_genes,
  };
}

/**
 * Retrieves the genes in a pathway and sets them in the form state in response to a selected pathway,
 * using the backend /scfind/pathway-genes endpoint which resolves pathway genes from UBKG and
 * validates them in a single request.
 */
export function useSelectedPathwayParticipants() {
  const { watch, setValue, getValues, formState } = useMolecularDataQueryFormState();
  const { toastError } = useSnackbarActions();
  const [isLoadingPathwayGenes, setIsLoadingPathwayGenes] = useState(false);
  const [invalidGenes, setInvalidGenes] = useState<string[]>([]);
  const [allGenesExcludedPathway, setAllGenesExcludedPathway] = useState<string | null>(null);
  // Valid pathway genes surfaced to the render (mirrors previousScFindGenesRef, which the
  // effect still reads/writes across renders). Kept in state so React re-renders when it changes
  // and so render never reads a ref's `.current` (react-hooks/refs).
  const [participants, setParticipants] = useState<string[]>([]);

  const selectedPathway = watch('pathway');
  const queryMethod = watch('queryMethod'); // Watch the query method
  const queryType = watch('queryType'); // Watch the query type

  const pathwayName: string | undefined =
    selectedPathway && typeof selectedPathway === 'object' && 'full' in selectedPathway
      ? (selectedPathway as { full?: string }).full?.split(' (')[0] // Remove the R-HSA code
      : undefined;

  // Extract the selected pathway code from the selected pathway object
  const pathwayCode: string | undefined =
    Array.isArray(selectedPathway?.values) && typeof selectedPathway.values[0] === 'string'
      ? selectedPathway.values[0]
      : undefined;

  // Hold previous pathway code for clearing genes when pathway is removed
  const previousPathwayCodeRef = useRef<string | undefined>(undefined);
  // Hold previous valid genes from scFind pathway for clearing
  const previousScFindGenesRef = useRef<string[]>([]);
  // Hold a ref to the current AbortController for canceling validation requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Update the selected genes on pathway change
  useEffect(() => {
    if (!formState.isSubmitted) {
      // Abort any ongoing validation request when pathway changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      const updateGenes = async () => {
        if (selectedPathway && pathwayCode && queryType === 'gene') {
          // Clear previous invalid genes and exclusion warning when starting a new pathway
          setInvalidGenes([]);
          setAllGenesExcludedPathway(null);

          setIsLoadingPathwayGenes(true);
          const abortController = new AbortController();
          abortControllerRef.current = abortController;

          try {
            const { validGenes, invalidGenes: newInvalidGenes } = await fetchScFindPathwayGenes(
              pathwayCode,
              queryMethod,
              abortController.signal,
            );

            if (abortController.signal.aborted) return;

            setInvalidGenes(newInvalidGenes);

            if (validGenes.length === 0) {
              setAllGenesExcludedPathway(pathwayName ?? 'the selected pathway');
              setValue('pathway', null);
              return;
            }

            previousPathwayCodeRef.current = pathwayCode;
            previousScFindGenesRef.current = validGenes;
            setParticipants(validGenes);

            const genes = validGenes.map((gene) => ({
              full: gene,
              pre: '',
              match: gene,
              post: '',
              tags: [],
            }));
            setValue('genes', genes);
          } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;
            console.error('Failed to fetch pathway genes:', err);
            toastError('Failed to load pathway genes. Please try again.');
          } finally {
            if (!abortController.signal.aborted) {
              setIsLoadingPathwayGenes(false);
              abortControllerRef.current = null;
            }
          }
        } else {
          // If the pathway was removed, clear the genes that were in that pathway.
          setInvalidGenes([]);
          setIsLoadingPathwayGenes(false);
          if (queryType === 'gene') {
            const currentGenes = getValues('genes');
            if (!currentGenes) return;

            if (previousScFindGenesRef.current.length > 0) {
              // Use the stored previous genes to remove only pathway genes
              const filteredGenes = currentGenes.filter((gene) => !previousScFindGenesRef.current.includes(gene.full));
              setValue('genes', filteredGenes);
              previousScFindGenesRef.current = [];
              setParticipants([]);
              previousPathwayCodeRef.current = undefined;
            }
          }
        }
      };

      updateGenes().catch((error) => {
        console.error('Failed to update genes from pathway:', error);
        setIsLoadingPathwayGenes(false);
      });
    }
    // Cleanup function to abort validation if component unmounts or pathway changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [
    pathwayCode,
    selectedPathway,
    setValue,
    formState.isSubmitted,
    getValues,
    queryMethod,
    pathwayName,
    queryType,
    toastError,
  ]);

  return {
    pathwayName,
    pathwayCode,
    participants,
    isLoadingPathwayGenes,
    invalidGenes,
    allGenesExcludedPathway,
  };
}
