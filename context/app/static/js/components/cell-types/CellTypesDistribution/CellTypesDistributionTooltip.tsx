import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { decimal, percent } from 'js/helpers/number-format';
import { TooltipData } from 'js/shared-styles/charts/types';
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { ChartData } from './types';
import { useCellTypeDataContext } from './contexts';
import { useCellTypesDetailPageContext } from '../CellTypesDetailPageContext';
import { CellTypeCountWithPercentageAndOrgan } from './utils';

interface TooltipTableProps {
  organ: string;
  cellTypes: string[];
  cellTypeCounts: CellTypeCountWithPercentageAndOrgan[];
}

function TooltipTable({ organ, cellTypes, cellTypeCounts }: TooltipTableProps) {
  const { targetCellTypes, totalOtherCount, totalCellsInOrgan } = cellTypeCounts.reduce<{
    targetCellTypes: CellTypeCountWithPercentageAndOrgan[];
    otherCellTypes: CellTypeCountWithPercentageAndOrgan[];
    totalOtherCount: number;
    totalCellsInOrgan: number;
  }>(
    (acc, count) => {
      if (cellTypes.includes(count.name)) {
        acc.targetCellTypes.push(count);
      } else {
        acc.otherCellTypes.push(count);
        acc.totalOtherCount += count.count;
      }
      acc.totalCellsInOrgan += count.count;
      return acc;
    },
    {
      targetCellTypes: [],
      otherCellTypes: [],
      totalOtherCount: 0,
      totalCellsInOrgan: 0,
    },
  );

  const { colorScale } = useCellTypeDataContext();

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body2" fontWeight="bold">
        {organ}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Cell Type</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {targetCellTypes.map(({ name, count }) => (
            <TableRow key={name}>
              <TableCell aria-hidden padding="checkbox">
                <Stack direction="row" alignItems="center">
                  <svg width="1em" height="1em" style={{ borderRadius: '0.25rem', marginRight: '-0.5rem' }}>
                    <rect fill={colorScale(name)} width="1em" height="1em" />
                  </svg>
                </Stack>
              </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{decimal.format(count)}</TableCell>
              <TableCell>{percent.format(count / totalCellsInOrgan)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Other Cell Types</TableCell>
            <TableCell>{decimal.format(totalOtherCount)}</TableCell>
            <TableCell>{percent.format(totalOtherCount / totalCellsInOrgan)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell aria-hidden padding="checkbox" />
            <TableCell>Total</TableCell>
            <TableCell colSpan={2}>{decimal.format(totalCellsInOrgan)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Stack>
  );
}

function AxisLabelTooltip({ label }: { label: string }) {
  const { cellTypeCounts } = useCellTypeDataContext();
  const cellTypeCountsForOrgan = cellTypeCounts[label];
  const { cellTypes } = useCellTypesDetailPageContext();
  const formattedCellTypes = cellTypes.map((type) => formatCellTypeName(type));
  return <TooltipTable organ={label} cellTypes={formattedCellTypes} cellTypeCounts={cellTypeCountsForOrgan} />;
}

export default function CellTypesDistributionChartTooltip({ tooltipData }: { tooltipData: TooltipData<ChartData> }) {
  const { bar, key: tooltipKey } = tooltipData;
  const { cellTypeCounts } = useCellTypeDataContext();
  const { cellTypes } = useCellTypesDetailPageContext();
  if (!bar?.data) {
    return <AxisLabelTooltip label={String(tooltipKey)} />;
  }
  const { organ } = bar.data;
  const cellTypeName = String(tooltipKey);
  const cellTypeCountsForOrgan = cellTypeCounts[bar.data.organ];
  const formattedCellTypes = cellTypes.map((type) => formatCellTypeName(type));
  return (
    <TooltipTable
      organ={organ}
      cellTypes={[cellTypeName, ...formattedCellTypes]}
      cellTypeCounts={cellTypeCountsForOrgan}
    />
  );
}
