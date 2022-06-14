import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { filterFieldConfigs, getFieldEntriesSortedByConfigureGroup } from './utils';
import { FlexGrow, StyledSearchBar } from './style';

function ConfigureSearchTable({
  selectedFields,
  selectedFacets,
  handleToggleField,
  handleToggleFacet,
  availableFields,
}) {
  const { numericFacetsProps } = useStore();
  const [searchBarFieldName, setSearchBarFieldName] = useState('');

  const handleChange = (event) => {
    setSearchBarFieldName(event.target.value);
  };

  const filteredFields = filterFieldConfigs(getFieldEntriesSortedByConfigureGroup(availableFields), searchBarFieldName);

  return (
    <FlexGrow>
      <StyledSearchBar fullWidth value={searchBarFieldName} onChange={handleChange} />
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
            {filteredFields.map(([fieldName, fieldConfig]) => (
              <TableRow key={fieldName}>
                <TableCell>{fieldConfig.label}</TableCell>
                {['string', 'boolean'].includes(fieldConfig.type) || numericFacetsProps?.[fieldName] ? (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </FlexGrow>
  );
}

export default ConfigureSearchTable;
