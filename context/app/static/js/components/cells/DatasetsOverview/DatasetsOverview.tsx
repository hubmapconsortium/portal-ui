import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Description from 'js/shared-styles/sections/Description';
import { useDatasetsOverview } from './hooks';
import DatasetsOverviewTable from './DatasetsOverviewTable';

interface DatasetsOverviewProps extends React.PropsWithChildren {
  datasets: string[];
}

export default function DatasetsOverview({ datasets, children }: DatasetsOverviewProps) {
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

  return (
    <>
      <Description>{children}</Description>
      <DatasetsOverviewTable indexed={indexed} all={all} matched={matched} />
    </>
  );
}
