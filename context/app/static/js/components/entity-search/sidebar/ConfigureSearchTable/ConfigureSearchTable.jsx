import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { excludeDateFieldConfigs, getFieldEntriesSortedByConfigureGroup } from './utils';

function ConfigureSearchTable({
  selectedFields,
  selectedFacets,
  handleToggleField,
  handleToggleFacet,
  availableFields,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Add Facet</TableCell>
            <TableCell>Add Column</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {excludeDateFieldConfigs(getFieldEntriesSortedByConfigureGroup(availableFields)).map(
            ([fieldName, fieldConfig]) => (
              <TableRow key={fieldName}>
                <TableCell>{fieldConfig.label}</TableCell>
                {fieldConfig.type === 'string' || fieldConfig?.range ? (
                  <TableCell>
                    <Checkbox
                      checked={fieldName in selectedFacets}
                      size="small"
                      color="primary"
                      onChange={(event) => handleToggleFacet(event, fieldConfig)}
                    />
                  </TableCell>
                ) : (
                  <TableCell />
                )}
                <TableCell>
                  <Checkbox
                    checked={fieldName in selectedFields}
                    size="small"
                    color="primary"
                    onChange={(event) => handleToggleField(event, fieldConfig)}
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ConfigureSearchTable;
