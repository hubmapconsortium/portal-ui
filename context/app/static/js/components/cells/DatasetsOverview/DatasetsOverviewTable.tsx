import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import Divider from '@mui/material/Divider';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import Stack from '@mui/material/Stack';
import { DatasetOverviewRow, DatasetsOverviewDigest, useFormattedRows } from './hooks';
import DownloadDatasetsOverview from './DownloadDatasetsOverview';

interface OverviewTableProps {
  indexed: DatasetsOverviewDigest;
  matched: DatasetsOverviewDigest;
  all: DatasetsOverviewDigest;
}

function DividerCell() {
  return (
    <TableCell aria-hidden sx={(theme) => ({ borderRight: `${theme.palette.divider} 1px solid` })}>
      <Divider orientation="vertical" />
    </TableCell>
  );
}

function OverviewTableRow({ label, matched, indexed, matchedIndexed, all, matchedAll }: DatasetOverviewRow) {
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{matched}</TableCell>
      <DividerCell />
      <TableCell>{indexed}</TableCell>
      <TableCell>{matchedIndexed}</TableCell>
      <DividerCell />
      <TableCell>{all}</TableCell>
      <TableCell>{matchedAll}</TableCell>
    </TableRow>
  );
}

const tooltips = {
  indexed: 'The number of HuBMAP datasets which are indexed in scFind.',
  all: 'The total datasets in HuBMAP, including those not indexed by scFind.',
};

export default function DatasetsOverviewTable({ matched, indexed, all }: OverviewTableProps) {
  const rows = useFormattedRows(matched, indexed, all);

  return (
    <>
      <Stack direction="row" justifyContent="end" width="100%" my={2}>
        <DownloadDatasetsOverview rows={rows} />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell>Matched</TableCell>
            <DividerCell />
            <TableCell>
              <InfoTextTooltip tooltipTitle={tooltips.indexed}>Indexed Datasets</InfoTextTooltip>
            </TableCell>
            <TableCell>Matched/Indexed (%)</TableCell>
            <DividerCell />
            <TableCell>
              <InfoTextTooltip tooltipTitle={tooltips.all}>Total Datasets</InfoTextTooltip>
            </TableCell>
            <TableCell>Matched/Total (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <OverviewTableRow key={row.label} {...row} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
