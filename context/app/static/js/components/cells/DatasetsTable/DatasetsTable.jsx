import React, { useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { animated } from '@react-spring/web';

import DatasetTableRow from 'js/components/cells/DatasetTableRow';
import { initialHeight } from 'js/components/cells/CellsResults/style';
import { useExpandSpring } from 'js/hooks/useExpand';
import { useAccordionStep } from 'js/shared-styles/accordions/StepAccordion';

const columns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'origin_samples_unique_mapped_organs', label: 'Organ' },
  { id: 'mapped_data_types', label: 'Mapped Data Types' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'donor.mapped_metadata.body_mass_index_value', label: 'Donor BMI' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race' },
  { id: 'last_modified_timestamp', label: 'Last Modified' },
  { id: 'expand', label: '' },
];

function DatasetsTable({ datasets, minExpression, cellVariableName, queryType }) {
  const { completeStep } = useAccordionStep();
  useEffect(() => {
    completeStep(`${datasets.length} Datasets Matching Query Parameters`);
  }, [completeStep, datasets]);
  const heightRef = useRef(null);

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
              key={_source.hubmap_id}
              minExpression={minExpression}
              cellVariableName={cellVariableName}
              queryType={queryType}
              isExpandedToStart={i === 0}
            />
          ))}
        </TableBody>
      </Table>
    </animated.div>
  );
}

export default DatasetsTable;
