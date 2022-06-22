import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import metadataFieldDescriptions from 'metadata-field-descriptions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { NoWrapIconTooltipCell, StyledIconTooltipCell } from './style';

function ConfigureSearchTable({
  selectedFields,
  selectedFacets,
  handleToggleField,
  handleToggleFacet,
  filteredFields,
}) {
  const { numericFacetsProps } = useStore();

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <NoWrapIconTooltipCell tooltipTitle="Selecting this checkbox will add the term as a facet for the search results.">
              Add Facet
            </NoWrapIconTooltipCell>
            <NoWrapIconTooltipCell tooltipTitle="Selecting this checkbox will add the term as a column for the search results table.">
              Add Column
            </NoWrapIconTooltipCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFields.map(([fieldName, fieldConfig]) => (
            <TableRow key={fieldName}>
              <StyledIconTooltipCell tooltipTitle={metadataFieldDescriptions[fieldConfig?.ingestValidationToolsName]}>
                {fieldConfig.label}
              </StyledIconTooltipCell>
              <TableCell padding="checkbox" align="center">
                {(['string', 'boolean'].includes(fieldConfig.type) || numericFacetsProps?.[fieldName]) && (
                  <Checkbox
                    checked={fieldName in selectedFacets}
                    size="small"
                    color="primary"
                    onChange={(event) => handleToggleFacet(event, fieldConfig)}
                  />
                )}
              </TableCell>
              <TableCell padding="checkbox" align="center">
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
  );
}

export default ConfigureSearchTable;
