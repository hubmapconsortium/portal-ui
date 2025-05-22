import { useDownloadTable } from 'js/helpers/download';
import React from 'react';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { DatasetOverviewRow, useDownloadableRows } from './hooks';

interface DownloadDatasetsOverviewProps {
  rows: DatasetOverviewRow[];
}

export default function DownloadDatasetsOverview({ rows }: DownloadDatasetsOverviewProps) {
  const variableNames = useCellVariableNames();
  const downloadTable = useDownloadTable({
    fileName: `datasets_overview_${variableNames.join('_')}.tsv`,
    columnNames: [
      'Metric',
      'Matched',
      'Indexed Datasets',
      'Matched/Indexed (%)',
      'Total Datasets',
      'Matched/Total (%)',
    ],
    rows: useDownloadableRows(rows),
  });
  return <DownloadButton tooltip="Download dataset overview statistics for current query" onClick={downloadTable} />;
}
