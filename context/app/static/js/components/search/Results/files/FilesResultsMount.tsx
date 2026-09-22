import React, { useMemo, useEffect, useState } from 'react';
import FilesResultsTable from './FilesResultsTable';
import { useSearch } from '../../Search';
import useDatasetPageStats, { DatasetStats } from './useDatasetPageStats';
import { CollapsedDatasetHit } from './utils';
import { useSearchStore } from '../../store';

function FilesResultsMount({ isLoading }: { isLoading: boolean }) {
  const { searchHits } = useSearch();
  const [datasetStats, setDatasetStats] = useState<{ stats?: Map<string, DatasetStats>; isLoading: boolean }>({
    isLoading: true,
  });
  const filters = useSearchStore((state) => state.filters);
  const [isBusy, setIsBusy] = useState(isLoading);

  const hits = useMemo(() => searchHits as CollapsedDatasetHit[], [searchHits]);

  const { getStats, fetchDatasetPageStats } = useDatasetPageStats();

  useEffect(() => {
    const datasetUuids = hits.map((hit) => hit._source?.dataset_uuid).filter((uuid): uuid is string => Boolean(uuid));
    const fetchStats = async () => {
      setIsBusy(false);
      setDatasetStats({ isLoading: true });
      const data = await fetchDatasetPageStats(datasetUuids);
      const stats = getStats(data);
      setDatasetStats({ isLoading: false, stats });
    };

    void fetchStats();
  }, [hits]);

  useEffect(() => {
    const updateBusy = async () => {
      await Promise.resolve(setIsBusy(true));
    };
    void updateBusy();
  }, [filters]);

  return <FilesResultsTable isLoading={isBusy} hits={hits} datasetStats={datasetStats} />;
}

export default FilesResultsMount;
