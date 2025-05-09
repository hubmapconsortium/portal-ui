import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { decimal, percent } from 'js/helpers/number-format';
import Divider from '@mui/material/Divider';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { DatasetsOverviewDigest } from './hooks';

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

interface TableRowProps {
  label: string;
  matched: number;
  indexed: number;
  all: number;
  noPercentage?: boolean;
}

function OverviewTableRow({ label, matched, indexed, all, noPercentage }: TableRowProps) {
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{decimal.format(matched)}</TableCell>
      <DividerCell />
      <TableCell>{decimal.format(indexed)}</TableCell>
      <TableCell>{noPercentage ? <>&mdash;</> : percent.format(matched / indexed)}</TableCell>
      <DividerCell />
      <TableCell>{decimal.format(all)}</TableCell>
      <TableCell>{noPercentage ? <>&mdash;</> : percent.format(matched / all)}</TableCell>
    </TableRow>
  );
}

const indexedDatasetsTooltip = 'The number of HuBMAP datasets which are indexed in scFind.';

const allDatasetsTooltip =
  'The total datasets in HuBMAP, including those not indexed by scFind. This includes datasets that are not compatible with scFind indexing due to incompatible data modalities or the availability of cell annotations.';

export default function DatasetsOverviewTable({ indexed, matched, all }: OverviewTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell>Matched</TableCell>
          <DividerCell />
          <TableCell>
            <InfoTextTooltip tooltipTitle={indexedDatasetsTooltip}>Indexed Datasets</InfoTextTooltip>
          </TableCell>
          <TableCell>Matched/Indexed (%)</TableCell>
          <DividerCell />
          <TableCell>
            <InfoTextTooltip tooltipTitle={allDatasetsTooltip}>Total Datasets</InfoTextTooltip>
          </TableCell>
          <TableCell>Matched/Total (%)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <OverviewTableRow
          label="Datasets"
          matched={matched.totalDatasets}
          indexed={indexed.totalDatasets}
          all={all.totalDatasets}
        />
        <OverviewTableRow
          label="Unique Donors"
          matched={matched.totalDonors}
          indexed={indexed.totalDonors}
          all={all.totalDonors}
        />
        <OverviewTableRow
          label="Average Donor Age (Years)"
          matched={matched.averageDonorAge}
          indexed={indexed.averageDonorAge}
          all={all.averageDonorAge}
          noPercentage
        />
        <OverviewTableRow
          label="Male Donors"
          matched={matched.maleDonors}
          indexed={indexed.maleDonors}
          all={all.maleDonors}
        />
        <OverviewTableRow
          label="Female Donors"
          matched={matched.femaleDonors}
          indexed={indexed.femaleDonors}
          all={all.femaleDonors}
        />
      </TableBody>
    </Table>
  );
}
