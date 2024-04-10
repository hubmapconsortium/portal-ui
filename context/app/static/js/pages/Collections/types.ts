interface Collection {
  uuid: string;
  title: string;
  hubmap_id: string;
  datasets: { hubmap_id: string }[];
}

interface CollectionHit {
  _source: Collection;
}

interface CollectionSearchHits {
  isLoading: boolean;
  searchHits: CollectionHit[];
}

export type { CollectionSearchHits, CollectionHit, Collection };
