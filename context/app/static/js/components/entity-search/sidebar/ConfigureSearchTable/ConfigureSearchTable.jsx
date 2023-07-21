import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

import metadataFieldDescriptions from 'metadata-field-descriptions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { NoWrapIconTooltipCell, StyledIconTooltipCell, StyledTableContainer } from './style';
import { useTableHeadHeight } from './hooks';

function ConfigureSearchTable({
  selectedFields,
  selectedFacets,
  handleToggleField,
  handleToggleFacet,
  filteredFields,
}) {
  const { numericFacetsProps } = useStore();

  const { tableHeadRef, tableHeadHeight } = useTableHeadHeight();
  return (
    <StyledTableContainer component={Paper} $tableHeadHeight={tableHeadHeight}>
      <Table stickyHeader>
        <TableHead ref={tableHeadRef}>
          <TableRow>
            <TableCell />
            <NoWrapIconTooltipCell tooltipTitle="Selecting a checkbox will add the term as a facet for the search results.">
              Add Facet
            </NoWrapIconTooltipCell>
            <NoWrapIconTooltipCell tooltipTitle="Selecting a checkbox will add the term as a column for the search results table.">
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
    </StyledTableContainer>
  );
}

export default ConfigureSearchTable;
