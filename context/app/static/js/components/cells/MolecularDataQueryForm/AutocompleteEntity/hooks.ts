import useSWR from 'swr';
import { useCellTypeNamesMap } from 'js/api/scfind/useCellTypeNames';
import { useEffect, useMemo } from 'react';
import { useGenePathwayParticipants, useGenePathways } from 'js/hooks/useUBKG';
import CellsService from '../../CellsService';
import type { AutocompleteQueryKey, AutocompleteQueryResponse, AutocompleteResult } from './types';
import { useMolecularDataQueryFormState } from '../hooks';

const cellsService = new CellsService();

interface AutocompleteQueryKeyExtended extends AutocompleteQueryKey {
  scFindCellTypeNames: Record<string, string[]>;
}

const fetchEntityAutocomplete = async ({
  targetEntity,
  substring,
  queryMethod,
  scFindCellTypeNames,
}: AutocompleteQueryKeyExtended): Promise<AutocompleteQueryResponse> => {
  if (!substring) {
    return [];
  }

  // scfind does not provide a matching query, so we can do this locally
  if (queryMethod === 'scFind' && targetEntity === 'cell-type') {
    const cellTypeNames = Object.keys(scFindCellTypeNames);
    const cellTypeNameMatches = cellTypeNames.filter((cellTypeName) =>
      cellTypeName.toLowerCase().includes(substring.toLowerCase()),
    );

    return cellTypeNameMatches.map((cellTypeName) => {
      const tags = scFindCellTypeNames[cellTypeName];

      const matchIndex = cellTypeName.toLowerCase().indexOf(substring.toLowerCase());
      const pre = cellTypeName.slice(0, matchIndex);
      const match = cellTypeName.slice(matchIndex, matchIndex + substring.length);
      const post = cellTypeName.slice(matchIndex + substring.length);

      return {
        full: cellTypeName,
        pre,
        match,
        post,
        tags,
        values: tags.map((tag) => `${tag}.${cellTypeName}`),
      };
    });
  }

  return cellsService.searchBySubstring({ targetEntity, substring });
};

export function useAutocompleteQuery(queryKey: AutocompleteQueryKey) {
  const scFindCellTypeNames = useCellTypeNamesMap();

  const key = useMemo(() => ({ ...queryKey, scFindCellTypeNames }), [queryKey, scFindCellTypeNames]);

  return useSWR(key, fetchEntityAutocomplete);
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

/**
 * Retrieves the genes in a pathway and sets them in the form state in response to a selected pathway.
 */
export function useSelectedPathwayParticipants() {
  const { watch, setValue, formState } = useMolecularDataQueryFormState();

  const selectedPathway = watch('pathway');

  const name: string | undefined =
    selectedPathway && typeof selectedPathway === 'object' && 'full' in selectedPathway
      ? (selectedPathway as { full?: string }).full?.split(' (')[0] // Remove the R-HSA code
      : undefined;

  const value: string | undefined =
    Array.isArray(selectedPathway?.values) && typeof selectedPathway.values[0] === 'string'
      ? selectedPathway.values[0]
      : undefined;

  const { data: pathway, isLoading } = useGenePathwayParticipants(value);

  useEffect(() => {
    if (selectedPathway && pathway && !formState.isSubmitted) {
      const genes = pathway.events.flatMap((event) => {
        // find the HUGO gene symbol sab in the event
        const hgncSab = event.sabs.find((sab) => sab.SAB === 'HGNC');
        if (!hgncSab) {
          return [];
        }
        return hgncSab.participants
          .map((participant) => participant.symbol)
          .filter((gene) => gene !== undefined)
          .map((gene) => ({
            full: gene,
            pre: '',
            match: gene,
            post: '',
            tags: [],
          }));
      });
      setValue('genes', genes);
    }
  }, [pathway, selectedPathway, setValue, isLoading, formState.isSubmitted]);

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

  return { isLoading, name, participants };
}
