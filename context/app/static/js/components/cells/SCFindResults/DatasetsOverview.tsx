import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import useIndexedDatasets from 'js/api/scfind/useIndexedDatasets';
import React from 'react';
import Description from 'js/shared-styles/sections/Description';
import { DatasetsOverviewType, useDatasetsOverview } from './hooks';

interface DatasetsOverviewProps {
  datasets: string[];
}

function DatasetsOverviewChart() {
  return (
    <div>
      <Description>
        The chart below shows the distribution of HuBMAP datasets that are compatible with the scFind method. The
        distribution is based on the number of unique donors and the average age of donors in each dataset.
      </Description>
    </div>
  );
}

interface OverviewTableProps {
  indexed: DatasetsOverviewType;
  matched: DatasetsOverviewType;
  all: DatasetsOverviewType;
}

const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function DatasetsOverviewTable({ indexed, matched, all }: OverviewTableProps) {
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
            <TableCell>{nf.format((matched.totalDatasets / indexed.totalDatasets) * 100)}%</TableCell>
            <TableCell>{all.totalDatasets}</TableCell>
            <TableCell>{nf.format((matched.totalDatasets / all.totalDatasets) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Unique Donors</TableCell>
            <TableCell>{matched.totalDonors}</TableCell>
            <TableCell>{indexed.totalDonors}</TableCell>
            <TableCell>{nf.format((matched.totalDonors / indexed.totalDonors) * 100)}%</TableCell>
            <TableCell>{all.totalDonors}</TableCell>
            <TableCell>{nf.format((matched.totalDonors / all.totalDonors) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average Donor Age (Years)</TableCell>
            <TableCell>{nf.format(matched.averageDonorAge)}</TableCell>
            <TableCell>{nf.format(indexed.averageDonorAge)}</TableCell>
            <TableCell>&mdash;</TableCell>
            <TableCell>{nf.format(all.averageDonorAge)}</TableCell>
            <TableCell>&mdash;</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Male Donors</TableCell>
            <TableCell>{matched.maleDonors}</TableCell>
            <TableCell>{indexed.maleDonors}</TableCell>
            <TableCell>{nf.format((matched.maleDonors / indexed.maleDonors) * 100)}%</TableCell>
            <TableCell>{all.maleDonors}</TableCell>
            <TableCell>{nf.format((matched.maleDonors / all.maleDonors) * 100)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Female Donors</TableCell>
            <TableCell>{matched.femaleDonors}</TableCell>
            <TableCell>{indexed.femaleDonors}</TableCell>
            <TableCell>{nf.format((matched.femaleDonors / indexed.femaleDonors) * 100)}%</TableCell>
            <TableCell>{all.femaleDonors}</TableCell>
            <TableCell>{nf.format((matched.femaleDonors / all.femaleDonors) * 100)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

export default function DatasetsOverview({ datasets }: DatasetsOverviewProps) {
  const { data: indexedDatasets, isLoading, error } = useIndexedDatasets();
  const indexed = useDatasetsOverview(indexedDatasets?.datasets ?? []);
  const all = useDatasetsOverview();
  const matched = useDatasetsOverview(datasets);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <DatasetsOverviewTable indexed={indexed} all={all} matched={matched} />
      <DatasetsOverviewChart />
    </>
  );
}
