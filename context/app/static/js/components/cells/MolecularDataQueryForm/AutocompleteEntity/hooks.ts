import useSWR from 'swr';
import { useEffect, useMemo, useRef } from 'react';
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
 * Retrieves the genes in a pathway and sets them in the form state in response to a selected pathway.
 */
export function useSelectedPathwayParticipants() {
  const { watch, setValue, getValues, formState } = useMolecularDataQueryFormState();

  const selectedPathway = watch('pathway');

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

  // Update the selected genes on pathway change
  useEffect(() => {
    if (formState.isSubmitted) {
      // If the form has been submitted, do not update the genes.
      return;
    }
    if (selectedPathway && pathway) {
      // If a new pathway is selected, set the genes to the new pathway.
      previousSelectedPathway.current = pathway;
      const genes = getParticipantsFromPathway(pathway).map((gene) => ({
        full: gene,
        pre: '',
        match: gene,
        post: '',
        tags: [],
      }));
      setValue('genes', genes);
    } else {
      // If the pathway was removed, clear the genes that were in that pathway.
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
  }, [pathway, selectedPathway, setValue, isLoading, formState.isSubmitted, getValues]);

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

  return { isLoading, pathwayName, pathwayCode, participants };
}
