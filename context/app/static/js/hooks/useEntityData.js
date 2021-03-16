import { useState, useEffect } from 'react';
import { getAuthHeader } from 'js/helpers/functions';

function useEntityData(uuid, elasticsearchEndpoint, nexusToken) {
  const [entity, setEntity] = useState(undefined);
  useEffect(() => {
    async function getAndSetEntity() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({ query: { ids: { values: [uuid] } } }),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const results = await response.json();
      // eslint-disable-next-line no-underscore-dangle
      const resultEntity = results.hits.hits[0]._source;
      setEntity(resultEntity);
    }
    getAndSetEntity();
  }, [nexusToken, elasticsearchEndpoint, uuid]);

  return entity;
}

function useSearchData(uuid, elasticsearchEndpoint, nexusToken) {
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAndSetEntity() {
      const authHeader = getAuthHeader(nexusToken);
      const response = await fetch(elasticsearchEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          query: {
            bool: {
              filter: [
                {
                  term: {
                    ancestor_ids: uuid,
                  },
                },
                {
                  term: {
                    entity_type: 'dataset',
                  },
                },
              ],
            },
          },
          _source: [
            'uuid',
            'display_doi',
            'mapped_data_types',
            'descendant_counts',
            'origin_sample.mapped_organ',
            'status',
            'last_modified_timestamp',
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      if (!response.ok) {
        console.error('Search API failed', response);
        return;
      }
      const results = await response.json();
      // eslint-disable-next-line no-underscore-dangle
      const resultEntity = results.hits.hits;
      setSearchData(resultEntity);
      setIsLoading(false);
    }
    getAndSetEntity();
  }, [nexusToken, elasticsearchEndpoint, uuid]);

  return { searchData, isLoading };
}

export { useSearchData };
export default useEntityData;
