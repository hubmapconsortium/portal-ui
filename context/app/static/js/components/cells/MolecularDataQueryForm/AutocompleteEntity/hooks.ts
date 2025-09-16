import useSWR from 'swr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PathwayParticipantsResponse, useGenePathwayParticipants, useGenePathways } from 'js/hooks/useUBKG';
import CellsService from '../../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse, AutocompleteResult } from './types';
import { useMolecularDataQueryFormState } from '../hooks';

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
  if (queryMethod === 'scFind' && targetEntity === 'gene') {
    const urlParams = new URLSearchParams();
    urlParams.append('q', substring);
    urlParams.append('limit', '10');

    const response = await fetch(`/scfind/genes/autocomplete?${urlParams.toString()}`);
    const responseJson = (await response.json()) as ScFindGenesAutocompleteResponse;

    if ('error' in responseJson && responseJson.error) {
      throw new Error(responseJson.error);
    }

    return responseJson.results ?? [];
  }

  // Use SCFIND cell types autocomplete endpoint when scFind query method is selected
  if (queryMethod === 'scFind' && targetEntity === 'cell-type') {
    const urlParams = new URLSearchParams();
    urlParams.append('q', substring);
    urlParams.append('limit', '10');

    const response = await fetch(`/scfind/cell-types/autocomplete?${urlParams.toString()}`);
    const responseJson = (await response.json()) as ScFindCellTypesAutocompleteResponse;

    if ('error' in responseJson && responseJson.error) {
      throw new Error(responseJson.error);
    }

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

function getParticipantsFromPathway(pathway?: PathwayParticipantsResponse): string[] {
  if (!pathway) {
    return [];
  }
  return pathway.events.flatMap((event) => {
    const hgncSab = event.sabs.find((sab) => sab.SAB === 'HGNC');
    if (!hgncSab) {
      return [];
    }
    return hgncSab.participants.map((participant) => participant.symbol).filter((gene) => gene !== undefined);
  });
}

/**
 * Validates genes against the selected data source (SCFIND or Cells API) to check if they exist.
 * This is used to filter pathway genes when a pathway is selected,
 * ensuring only genes that are indexed in the selected data source are included.
 * @param genes Array of gene symbols to validate
 * @param queryMethod The selected query method ('scFind' or other)
 * @param abortSignal Optional AbortSignal to cancel the request
 * @returns Promise that resolves to an object with valid and invalid gene arrays
 */
async function validateGenesWithDataSource(
  genes: string[],
  queryMethod: string,
  abortSignal?: AbortSignal,
): Promise<{
  validGenes: string[];
  invalidGenes: string[];
}> {
  try {
    // Use the appropriate validation endpoint based on query method
    const endpoint = queryMethod === 'scFind' ? '/scfind/genes/validate' : '/cells/genes/validate';

    const requestBody: { genes: string[]; modality?: string } = { genes };

    // Include modality for Cells API validation
    if (queryMethod !== 'scFind') {
      const modality = queryMethod === 'crossModalityATAC' ? 'atac' : 'rna';
      requestBody.modality = modality;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = (await response.json()) as {
      valid_genes: string[];
      invalid_genes: string[];
      total_provided: number;
      total_valid: number;
      error?: string;
    };

    if (result.error) {
      throw new Error(result.error);
    }

    return {
      validGenes: result.valid_genes,
      invalidGenes: result.invalid_genes,
    };
  } catch (error) {
    // Check if the request was aborted
    if (error instanceof Error && error.name === 'AbortError') {
      throw error; // Re-throw abort errors so they can be handled appropriately
    }
    console.warn(`Failed to validate genes with ${queryMethod}:`, error);
    // Return all genes as valid if validation fails to avoid breaking the user experience
    return {
      validGenes: genes,
      invalidGenes: [],
    };
  }
}

/**
 * Retrieves the genes in a pathway and sets them in the form state in response to a selected pathway.
 * When scFind is the selected query method, genes that don't exist in SCFIND are automatically
 * filtered out to ensure compatibility with the selected data source.
 */
export function useSelectedPathwayParticipants() {
  const { watch, setValue, getValues, formState } = useMolecularDataQueryFormState();
  const [isLoadingPathwayGenes, setIsLoadingPathwayGenes] = useState(false);
  const [invalidGenes, setInvalidGenes] = useState<string[]>([]);

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

  const { data: pathway, isLoading } = useGenePathwayParticipants(pathwayCode);

  // Hold on to previous selected pathway to clear the genes when the pathway is removed
  const previousSelectedPathway = useRef(pathway);
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
        if (selectedPathway && pathway) {
          // If a new pathway is selected, set the genes to the new pathway.
          previousSelectedPathway.current = pathway;
          let pathwayGenes = getParticipantsFromPathway(pathway);

          // Clear previous invalid genes when starting a new pathway
          setInvalidGenes([]);

          // Filter genes through validation only if query type is "gene" and we have genes
          if (queryType === 'gene' && pathwayGenes.length > 0) {
            setIsLoadingPathwayGenes(true);
            // Create a new AbortController for this validation request
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
              const { validGenes, invalidGenes: newInvalidGenes } = await validateGenesWithDataSource(
                pathwayGenes,
                queryMethod,
                abortController.signal,
              );

              // Check if the request was aborted before updating state
              if (abortController.signal.aborted) {
                return;
              }

              pathwayGenes = validGenes;
              setInvalidGenes(newInvalidGenes);

              const originalCount = getParticipantsFromPathway(pathway).length;
              const filteredCount = validGenes.length;

              if (originalCount !== filteredCount) {
                // eslint-disable-next-line no-console
                console.info(
                  `Pathway genes filtered for ${queryMethod} compatibility: ${originalCount} → ${filteredCount} genes`,
                  {
                    pathway: pathwayName,
                    filtered: originalCount - filteredCount,
                    invalidGenes: newInvalidGenes,
                  },
                );
              }
            } catch (error) {
              // If the request was aborted, don't update the loading state or show errors
              if (error instanceof Error && error.name === 'AbortError') {
                return;
              }
              console.error('Failed to validate pathway genes:', error);
            } finally {
              // Only clear loading state if the request wasn't aborted
              if (!abortController.signal.aborted) {
                setIsLoadingPathwayGenes(false);
                abortControllerRef.current = null;
              }
            }
          }

          const genes = pathwayGenes.map((gene) => ({
            full: gene,
            pre: '',
            match: gene,
            post: '',
            tags: [],
          }));
          // Only set genes when the query type is "gene"
          if (queryType === 'gene') {
            setValue('genes', genes);
          }
        } else {
          // If the pathway was removed, clear the genes that were in that pathway.
          setInvalidGenes([]);
          setIsLoadingPathwayGenes(false);
          // Only manage genes when the query type is "gene"
          if (queryType === 'gene') {
            const currentGenes = getValues('genes');
            if (!currentGenes || !previousSelectedPathway.current) {
              return;
            }
            const previousParticipants = getParticipantsFromPathway(previousSelectedPathway.current);
            const filteredGenes = currentGenes.filter((gene) => {
              return !previousParticipants.includes(gene.full);
            });
            setValue('genes', filteredGenes);
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
    pathway,
    selectedPathway,
    setValue,
    isLoading,
    formState.isSubmitted,
    getValues,
    queryMethod,
    pathwayName,
    queryType,
  ]);

  const participants = useMemo(() => {
    if (!pathway) {
      return [];
    }
    return pathway.events.flatMap((event) => {
      // find the HUGO gene symbol sab in the event
      const hgncSab = event.sabs.find((sab) => sab.SAB === 'HGNC')!;
      if (!hgncSab) {
        return [];
      }
      return hgncSab.participants.map((participant) => participant.symbol).filter((gene) => gene !== undefined);
    });
  }, [pathway]);

  return {
    isLoading,
    pathwayName,
    pathwayCode,
    participants,
    isLoadingPathwayGenes,
    invalidGenes,
  };
}
