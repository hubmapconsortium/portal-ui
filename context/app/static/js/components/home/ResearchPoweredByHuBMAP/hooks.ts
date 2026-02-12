import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { homepagePublicationsQuery } from './queries';

export interface HomepagePublication {
  uuid: string;
  title: string;
  contributors: ContributorAPIResponse[];
  publication_venue: string;
  publication_date: string;
  publication_status: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function parsePinnedUUIDs(raw: unknown): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const DISPLAY_COUNT = 6;

export function usePublicationsForHomepage(pinnedUUIDs: string[]) {
  const { searchHits, isLoading } = useSearchHits<HomepagePublication>(homepagePublicationsQuery);

  const publications = useMemo(() => {
    if (!searchHits.length) return [];

    const allPubs = searchHits.map((hit) => hit._source);
    const pinned = pinnedUUIDs.length > 0 ? allPubs.filter((pub) => pinnedUUIDs.includes(pub.uuid)) : [];
    const nonPinned = pinnedUUIDs.length > 0 ? allPubs.filter((pub) => !pinnedUUIDs.includes(pub.uuid)) : allPubs;
    const shuffledNonPinned = shuffleArray(nonPinned);
    const slotsForNonPinned = DISPLAY_COUNT - pinned.length;
    return [...pinned, ...shuffledNonPinned.slice(0, Math.max(0, slotsForNonPinned))];
  }, [searchHits, pinnedUUIDs]);

  return { publications, isLoading };
}
