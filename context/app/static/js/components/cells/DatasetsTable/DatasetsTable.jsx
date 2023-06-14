import React, { useEffect, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { animated } from 'react-spring';

import DatasetTableRow from 'js/components/cells/DatasetTableRow';
import { initialHeight } from 'js/components/cells/CellsResults/style';
import { useExpandTransition } from 'js/hooks/useExpand';

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

function DatasetsTable({ datasets, minExpression, cellVariableName, completeStep, queryType }) {
  useEffect(() => {
    completeStep(`${datasets.length} Datasets Matching Query Parameters`);
  }, [completeStep, datasets]);
  const heightRef = useRef(null);

  const transitions = useExpandTransition(heightRef, initialHeight);

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={{ ...props, width: '100%' }}>
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
      ),
  );
}

export default DatasetsTable;
