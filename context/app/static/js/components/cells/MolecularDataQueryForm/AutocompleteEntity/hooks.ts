import useSWR from 'swr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGenePathways } from 'js/hooks/useUBKG';
import { fetcher } from 'js/helpers/swr';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import CellsService from '../../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse, AutocompleteResult } from './types';
import { getScFindModality, isScFindMethod, useMolecularDataQueryFormState } from '../hooks';

const cellsService = new CellsService();

interface ScFindGenesAutocompleteResponse {
  results?: AutocompleteResult[];
  error?: string;
}

interface ScFindCellTypesAutocompleteResponse {
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

  // Use SCFIND endpoints for genes and cell types when scFind query method is selected
  if (isScFindMethod(queryMethod) && targetEntity === 'gene') {
    const urlParams = new URLSearchParams();
    urlParams.append('q', substring);
    urlParams.append('limit', '10');
    const modality = getScFindModality(queryMethod);
    if (modality) {
      urlParams.append('modality', modality);
    }

    const responseJson = await fetcher<ScFindGenesAutocompleteResponse>({
      url: `/scfind/genes/autocomplete?${urlParams.toString()}`,
    });

    return responseJson.results ?? [];
  }

  // Use SCFIND cell types autocomplete endpoint when scFind query method is selected
  if (isScFindMethod(queryMethod) && targetEntity === 'cell-type') {
    const urlParams = new URLSearchParams();
    urlParams.append('q', substring);
    urlParams.append('limit', '10');
    const modality = getScFindModality(queryMethod);
    if (modality) {
      urlParams.append('modality', modality);
    }

    const responseJson = await fetcher<ScFindCellTypesAutocompleteResponse>({
      url: `/scfind/cell-types/autocomplete?${urlParams.toString()}`,
    });

    // Return results as-is since the backend now handles organ grouping and tags
    return responseJson.results ?? [];
  }

  // For non-scFind queries, use the traditional cell service
  return cellsService.searchBySubstring({ targetEntity, substring });
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
 * Fetches pathway genes from the backend, which resolves pathway participants from UBKG
 * and validates them against the Cells API gene list for the given modality.
 * This collapses 2 network requests (UBKG fetch + Cells API validate) into 1.
 */
async function fetchCrossModalityPathwayGenes(
  pathwayCode: string,
  queryMethod: string,
  abortSignal?: AbortSignal,
): Promise<{ validGenes: string[]; invalidGenes: string[] }> {
  const modality = queryMethod === 'crossModalityATAC' ? 'atac' : 'rna';

  const result = await fetcher<PathwayGenesResponse>({
    url: '/cells/pathway-genes',
    requestInit: {
      method: 'POST',
      body: JSON.stringify({ pathway_code: pathwayCode, modality }),
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
 * Retrieves the genes in a pathway and sets them in the form state in response to a selected pathway.
 * For scFind methods, uses the backend /scfind/pathway-genes endpoint which resolves pathway genes
 * from UBKG and validates them in a single request.
 * For crossModality methods, uses the existing UBKG fetch + Cells API validate flow.
 */
export function useSelectedPathwayParticipants() {
  const { watch, setValue, getValues, formState } = useMolecularDataQueryFormState();
  const { toastError } = useSnackbarActions();
  const [isLoadingPathwayGenes, setIsLoadingPathwayGenes] = useState(false);
  const [invalidGenes, setInvalidGenes] = useState<string[]>([]);
  const [allGenesExcludedPathway, setAllGenesExcludedPathway] = useState<string | null>(null);

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

  const isScFind = isScFindMethod(queryMethod);

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

          if (isScFind) {
            // For scFind methods, use the backend endpoint that handles UBKG + validation in one request
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
            // For crossModality methods, use the backend endpoint that handles UBKG + validation
            setIsLoadingPathwayGenes(true);
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
              const { validGenes, invalidGenes: newInvalidGenes } = await fetchCrossModalityPathwayGenes(
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
    isScFind,
    toastError,
  ]);

  // Both scFind and crossModality paths store valid genes in previousScFindGenesRef
  const participants = previousScFindGenesRef.current;

  return {
    pathwayName,
    pathwayCode,
    participants,
    isLoadingPathwayGenes,
    invalidGenes,
    allGenesExcludedPathway,
  };
}
