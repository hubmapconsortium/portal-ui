import { useCallback, useState } from 'react';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchResponseBody } from 'js/typings/elasticsearch';
import { useSearchStore } from '../../store';
import { buildQuery } from '../../utils';
import useESmapping, { isESMapping } from '../../useEsMapping';
import { useFilesSelectionStore } from './useFilesSelectionStore';
import { FileDocument } from './utils';

/** Files fetched per request while enumerating. The index's `max_result_window` is 10,000. */
const ENUMERATE_PAGE_SIZE = 10_000;

/**
 * Upper bound on files added in one go.
 *
 * A manifest line is ~40 bytes, so 50,000 lines is ~2MB -- already large but usable. Beyond this
 * the action refuses rather than truncating: an unfiltered query matches 9.9M files, and silently
 * adding the first 50,000 of them would produce a manifest that looks complete and is not.
 *
 * Collapsing fully-matching datasets to a single `HBM… /` line was considered and measured; it
 * turns out never to fire for a real filter, because no dataset consists solely of one file type
 * (every one also holds sidecar `.json`/`.txt`/`.tsv` files and a root `metadata.json`).
 */
export const ADD_ALL_MAX_FILES = 50_000;

export type AddAllState =
  | { status: 'idle' }
  | { status: 'counting' }
  | { status: 'adding'; added: number }
  | { status: 'too-many'; total: number }
  | { status: 'done'; added: number }
  | { status: 'error' };

/**
 * Adds every file matching the current query to the selection.
 *
 * Enumerates with `search_after` over an uncollapsed query, so it sees individual files rather
 * than one row per dataset. Sorted by `(dataset_uuid, rel_path)` to give the tiebreaker uniqueness
 * `search_after` needs.
 */
export default function useAddAllMatchingFiles() {
  const { groupsToken } = useAppContext();
  const endpoint = useSearchStore((state) => state.endpoint);
  const mappingIndex = useSearchStore((state) => state.mappingIndex);
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const search = useSearchStore((state) => state.search);
  const searchFields = useSearchStore((state) => state.searchFields);
  const hubmapIdField = useSearchStore((state) => state.hubmapIdField);
  const uuidField = useSearchStore((state) => state.uuidField);
  const filenameFilter = useSearchStore((state) => state.filenameFilter);
  const filenameField = useSearchStore((state) => state.filenameField);
  const addFiles = useFilesSelectionStore((state) => state.addFiles);

  const mappings = useESmapping(mappingIndex);
  const [state, setState] = useState<AddAllState>({ status: 'idle' });

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  const addAll = useCallback(async () => {
    if (!isESMapping(mappings)) {
      return;
    }

    const baseQuery = buildQuery({
      filters,
      facets,
      search,
      size: ENUMERATE_PAGE_SIZE,
      searchFields,
      sourceFields: { manifest: ['dataset_uuid', 'dataset_hubmap_id', 'rel_path'] },
      // Unique per document, which `search_after` requires.
      sortField: { field: 'dataset_uuid', direction: 'asc' },
      uniqueSortField: 'rel_path.keyword',
      filterMode: 'query',
      hubmapIdField,
      uuidField,
      filenameFilter,
      filenameField,
      mappings,
      buildAggregations: false,
    }) as Record<string, unknown> | null;

    if (!baseQuery) {
      return;
    }

    const post = (extra: Record<string, unknown>) =>
      fetcher<SearchResponseBody<FileDocument, unknown>>({
        url: endpoint,
        requestInit: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader(groupsToken) },
          body: JSON.stringify({ ...baseQuery, ...extra }),
        },
      });

    setState({ status: 'counting' });
    try {
      // Check the size of the job before doing any of it, so a 9.9M-file query is refused rather
      // than half-completed.
      const first = await post({ size: 0, track_total_hits: true });
      const total = first.hits?.total;
      const totalCount = typeof total === 'number' ? total : (total?.value ?? 0);

      if (totalCount === 0) {
        setState({ status: 'done', added: 0 });
        return;
      }
      if (totalCount > ADD_ALL_MAX_FILES) {
        setState({ status: 'too-many', total: totalCount });
        return;
      }

      const byDataset = new Map<string, { hubmapId: string; relPaths: string[] }>();
      let searchAfter: unknown[] | undefined;
      let added = 0;

      for (;;) {
        setState({ status: 'adding', added });
        const page = await post(searchAfter ? { search_after: searchAfter } : {});
        const hits = page.hits?.hits ?? [];
        if (hits.length === 0) {
          break;
        }
        hits.forEach((hit) => {
          const source = hit._source;
          if (!source?.dataset_uuid || !source?.rel_path) return;
          const entry = byDataset.get(source.dataset_uuid) ?? {
            hubmapId: source.dataset_hubmap_id,
            relPaths: [],
          };
          entry.relPaths.push(source.rel_path);
          byDataset.set(source.dataset_uuid, entry);
        });
        added += hits.length;
        searchAfter = hits[hits.length - 1]?.sort as unknown[] | undefined;
        if (hits.length < ENUMERATE_PAGE_SIZE || !searchAfter) {
          break;
        }
      }

      addFiles(byDataset);
      setState({ status: 'done', added });
    } catch (e) {
      console.error(e);
      setState({ status: 'error' });
    }
  }, [
    mappings,
    filters,
    facets,
    search,
    searchFields,
    hubmapIdField,
    uuidField,
    filenameFilter,
    filenameField,
    endpoint,
    groupsToken,
    addFiles,
  ]);

  return { addAll, state, reset };
}
