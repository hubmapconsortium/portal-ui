import React, { useRef } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { animated } from '@react-spring/web';

import DatasetTableRow from 'js/components/cells/DatasetTableRow';
import { initialHeight } from 'js/components/cells/MolecularDataQueryResults/style';
import { useExpandSpring } from 'js/hooks/useExpand';
import { Dataset } from 'js/components/types';
import { WrappedCellsResultsDataset } from '../types';
import CellsCharts from '../CellsCharts';

const columns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'origin_samples_unique_mapped_organs', label: 'Organ' },
  { id: 'dataset_type', label: 'Data Type' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'expand', label: '' },
];

interface DatasetsTableProps {
  datasets: WrappedCellsResultsDataset[];
  expandedContent?: React.ComponentType<Dataset>;
}

function DatasetsTable({ datasets = [], expandedContent = CellsCharts }: DatasetsTableProps) {
  const heightRef = useRef<HTMLTableElement>(null);

  const props = useExpandSpring(heightRef, initialHeight, datasets?.length > 0);

  return (
    <animated.div style={{ ...props, width: '100%' }}>
      <Table stickyHeader ref={heightRef}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {datasets.map(({ _source }, i) => (
            <DatasetTableRow
              datasetMetadata={_source}
              numCells={columns.length}
              isExpandedToStart={i === 0}
              key={_source.hubmap_id}
              expandedContent={expandedContent}
            />
          ))}
        </TableBody>
      </Table>
    </animated.div>
  );
}

export default DatasetsTable;
