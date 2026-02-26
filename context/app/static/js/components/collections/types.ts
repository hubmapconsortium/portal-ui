import { SearchHit } from 'js/typings/elasticsearch';

interface Collection {
  uuid: string;
  title: string;
  hubmap_id: string;
  created_timestamp: number;
  datasets: { hubmap_id: string; uuid: string }[];
}

type CollectionHit = Pick<Required<SearchHit<Collection>>, '_source'>;

export type { Collection, CollectionHit };
