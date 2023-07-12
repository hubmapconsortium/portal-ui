import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import {
  lastModifiedTimestampCol,
  organCol,
  dataTypesCol,
  statusCol,
} from 'js/components/detailPage/derivedEntities/columns';

const columns = [
  organCol,
  dataTypesCol,
  lastModifiedTimestampCol,
  {
    id: 'created_by_user_displayname',
    label: 'Contact',
    renderColumnCell: ({ created_by_user_displayname }) => created_by_user_displayname,
  },
  statusCol,
];

function useCollectionsDatasets({ ids }) {
  const query = {
    query: {
      ...getIDsQuery(ids),
    },
    _source: ['hubmap_id', 'entity_type', ...columns.map((c) => c.id)],
    size: 10000,
  };

  const { searchHits: datasets } = useSearchHits(query);
  return { columns, datasets };
}

export { useCollectionsDatasets };
