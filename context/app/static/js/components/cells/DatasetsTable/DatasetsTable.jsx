import React, { useEffect, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { useTransition, animated, config } from 'react-spring';
import useResizeObserver from 'use-resize-observer/polyfilled';

import DatasetTableRow from 'js/components/cells/DatasetTableRow';

const columns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'origin_sample.mapped_organ', label: 'Organ' },
  { id: 'mapped_data_types', label: 'Mapped Data Types' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'donor.mapped_metadata.body_mass_index_value', label: 'Donor BMI' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race' },
  { id: 'last_modified_timestamp', label: 'Last Modified' },
  { id: 'expand', label: '' },
];

function DatasetsTable({ datasets, minExpression, cellVariableName, queryType, completeStep }) {
  useEffect(() => {
    completeStep(`${datasets.length} Datasets Matching Query Parameters`);
  }, [completeStep, datasets]);
  const heightRef = useRef(null);

  const { height = 0 } = useResizeObserver({ ref: heightRef });

  const transitions = useTransition(true, null, {
    from: { opacity: 0, height: 300 },
    enter: { opacity: 1, height },
    config: config.slow,
    update: { height },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props}>
          <Table stickyHeader ref={heightRef}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {datasets.map(({ _source }) => (
                <DatasetTableRow
                  datasetMetadata={_source}
                  numCells={columns.length}
                  key={_source.hubmap_id}
                  minExpression={minExpression}
                  cellVariableName={cellVariableName}
                  queryType={queryType}
                />
              ))}
            </TableBody>
          </Table>
        </animated.div>
      ),
  );
}

export default DatasetsTable;
