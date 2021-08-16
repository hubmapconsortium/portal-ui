import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import format from 'date-fns/format';

import { LightBlueLink } from 'js/shared-styles/Links';

const columns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'origin_sample.mapped_organ', label: 'Organ' },
  { id: 'mapped_data_types', label: 'Mapped Data Types' },
  { id: 'donor.mapped_metadata.age_value', label: 'Donor Age' },
  { id: 'donor.mapped_metadata.body_mass_index_value', label: 'Donor BMI' },
  { id: 'donor.mapped_metadata.sex', label: 'Donor Sex' },
  { id: 'donor.mapped_metadata.race', label: 'Donor Race' },

  { id: 'last_modified_timestamp', label: 'Last Modified' },
];

function DonorMetadataCell({ unit, value }) {
  return <TableCell>{`${value} ${unit}`}</TableCell>;
}

function DatasetsTable({ datasets }) {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id}>{column.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {datasets.map(({ _source }) => (
          <TableRow key={_source.hubmap_id}>
            <TableCell>
              <LightBlueLink href={`/browse/dataset/${_source.uuid}`}>{_source.hubmap_id}</LightBlueLink>
            </TableCell>
            <TableCell>{_source.origin_sample.mapped_organ}</TableCell>
            <TableCell>{_source.mapped_data_types.join(', ')}</TableCell>
            {['age', 'body_mass_index'].map((base) => (
              <DonorMetadataCell
                value={_source.donor.mapped_metadata[`${base}_value`]}
                unit={_source.donor.mapped_metadata[`${base}_unit`]}
              />
            ))}
            <TableCell>{_source.donor.mapped_metadata.sex}</TableCell>
            <TableCell>{_source.donor.mapped_metadata.race.join(', ')}</TableCell>
            <TableCell>{format(_source.last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DatasetsTable;
