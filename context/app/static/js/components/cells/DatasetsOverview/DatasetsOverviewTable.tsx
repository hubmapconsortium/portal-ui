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

export default function DatasetsOverviewTable({ indexed, matched, all }: OverviewTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell>Matched</TableCell>
          <DividerCell />
          <TableCell>
            <InfoTextTooltip tooltipTitle="The number of HuBMAP datasets which are indexed in scFind.">
              Indexed Datasets
            </InfoTextTooltip>
          </TableCell>
          <TableCell>Matched/Indexed (%)</TableCell>
          <DividerCell />
          <TableCell>
            <InfoTextTooltip
              tooltipTitle="The total datasets in HuBMAP, including those not indexed by scFind. This includes datasets that are not
                compatible with scFind indexing due to incompatible data modalities or the availability of cell annotations."
            >
              Total Datasets
            </InfoTextTooltip>
          </TableCell>
          <TableCell>Matched/Total (%)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Datasets</TableCell>
          <TableCell>{matched.totalDatasets}</TableCell>
          <DividerCell />
          <TableCell>{indexed.totalDatasets}</TableCell>
          <TableCell>{percent.format(matched.totalDatasets / indexed.totalDatasets)}</TableCell>
          <DividerCell />
          <TableCell>{all.totalDatasets}</TableCell>
          <TableCell>{percent.format(matched.totalDatasets / all.totalDatasets)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Unique Donors</TableCell>
          <TableCell>{matched.totalDonors}</TableCell>
          <DividerCell />
          <TableCell>{indexed.totalDonors}</TableCell>
          <TableCell>{percent.format(matched.totalDonors / indexed.totalDonors)}</TableCell>

          <DividerCell />
          <TableCell>{all.totalDonors}</TableCell>
          <TableCell>{percent.format(matched.totalDonors / all.totalDonors)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Average Donor Age (Years)</TableCell>
          <TableCell>{decimal.format(matched.averageDonorAge)}</TableCell>
          <DividerCell />
          <TableCell>{decimal.format(indexed.averageDonorAge)}</TableCell>
          <TableCell>&mdash;</TableCell>
          <DividerCell />
          <TableCell>{decimal.format(all.averageDonorAge)}</TableCell>
          <TableCell>&mdash;</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Male Donors</TableCell>
          <TableCell>{matched.maleDonors}</TableCell>
          <DividerCell />
          <TableCell>{indexed.maleDonors}</TableCell>
          <TableCell>{percent.format(matched.maleDonors / indexed.maleDonors)}</TableCell>
          <DividerCell />
          <TableCell>{all.maleDonors}</TableCell>
          <TableCell>{percent.format(matched.maleDonors / all.maleDonors)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Female Donors</TableCell>
          <TableCell>{matched.femaleDonors}</TableCell>
          <DividerCell />
          <TableCell>{indexed.femaleDonors}</TableCell>
          <TableCell>{percent.format(matched.femaleDonors / indexed.femaleDonors)}</TableCell>
          <DividerCell />
          <TableCell>{all.femaleDonors}</TableCell>
          <TableCell>{percent.format(matched.femaleDonors / all.femaleDonors)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
