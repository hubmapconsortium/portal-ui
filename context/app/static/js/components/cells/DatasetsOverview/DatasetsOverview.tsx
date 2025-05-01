import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useDatasetsOverview } from './hooks';
import DatasetsOverviewTable from './DatasetsOverviewTable';

interface DatasetsOverviewProps {
  datasets: string[];
}

export default function DatasetsOverview({ datasets }: DatasetsOverviewProps) {
  const { data: indexedDatasets, isLoading, error } = useIndexedDatasets();
  const indexed = useDatasetsOverview(indexedDatasets?.datasets ?? []);
  const all = useDatasetsOverview();
  const matched = useDatasetsOverview(datasets);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={300} />;
  }
  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return <DatasetsOverviewTable indexed={indexed} all={all} matched={matched} />;
}
