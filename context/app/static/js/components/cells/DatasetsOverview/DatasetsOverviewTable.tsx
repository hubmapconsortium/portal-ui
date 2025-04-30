import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import Description from 'js/shared-styles/sections/Description';
import { decimal } from 'js/helpers/number-format';
import { DatasetsOverviewDigest } from './hooks';

interface OverviewTableProps {
  indexed: DatasetsOverviewDigest;
  matched: DatasetsOverviewDigest;
  all: DatasetsOverviewDigest;
}

export default function DatasetsOverviewTable({ indexed, matched, all }: OverviewTableProps) {
  return (
    <>
      <Description>
        These results are derived from RNAseq datasets that were indexed by the scFind method. Not all HuBMAP datasets
        are currently compatible with this method due to data modalities or the availability of cell annotations. The
        table below summarizes the number of matched datasets and the proportions relative to scFind-indexed datasets
        and total HuBMAP datasets.
      </Description>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell>Matched</TableCell>
            <TableCell>Indexed Datasets</TableCell>
            <TableCell>Matched/Indexed (%)</TableCell>
            <TableCell>Total Datasets</TableCell>
            <TableCell>Matched/Total (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Datasets</TableCell>
            <TableCell>{matched.totalDatasets}</TableCell>
            <TableCell>{indexed.totalDatasets}</TableCell>
            <TableCell>{decimal.format((matched.totalDatasets / indexed.totalDatasets) * 100)}%</TableCell>
            <TableCell>{all.totalDatasets}</TableCell>
            <TableCell>{decimal.format((matched.totalDatasets / all.totalDatasets) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Unique Donors</TableCell>
            <TableCell>{matched.totalDonors}</TableCell>
            <TableCell>{indexed.totalDonors}</TableCell>
            <TableCell>{decimal.format((matched.totalDonors / indexed.totalDonors) * 100)}%</TableCell>
            <TableCell>{all.totalDonors}</TableCell>
            <TableCell>{decimal.format((matched.totalDonors / all.totalDonors) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average Donor Age (Years)</TableCell>
            <TableCell>{decimal.format(matched.averageDonorAge)}</TableCell>
            <TableCell>{decimal.format(indexed.averageDonorAge)}</TableCell>
            <TableCell>&mdash;</TableCell>
            <TableCell>{decimal.format(all.averageDonorAge)}</TableCell>
            <TableCell>&mdash;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Male Donors</TableCell>
            <TableCell>{matched.maleDonors}</TableCell>
            <TableCell>{indexed.maleDonors}</TableCell>
            <TableCell>{decimal.format((matched.maleDonors / indexed.maleDonors) * 100)}%</TableCell>
            <TableCell>{all.maleDonors}</TableCell>
            <TableCell>{decimal.format((matched.maleDonors / all.maleDonors) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Female Donors</TableCell>
            <TableCell>{matched.femaleDonors}</TableCell>
            <TableCell>{indexed.femaleDonors}</TableCell>
            <TableCell>{decimal.format((matched.femaleDonors / indexed.femaleDonors) * 100)}%</TableCell>
            <TableCell>{all.femaleDonors}</TableCell>
            <TableCell>{decimal.format((matched.femaleDonors / all.femaleDonors) * 100)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
