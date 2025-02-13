import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

interface Collection {
  uuid: string;
  title: string;
  hubmap_id: string;
  datasets: { hubmap_id: string; uuid: string }[];
}

type CollectionHit = Pick<Required<SearchHit<Collection>>, '_source'>;

export type { Collection, CollectionHit };
