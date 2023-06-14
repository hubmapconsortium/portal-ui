import React from 'react';
import TableHead from '@material-ui/core/TableHead';

import {
  StyledTable,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
} from 'js/components/searchPage/ResultsTable/style';
import SearchBarInput from 'js/shared-styles/inputs/SearchBar';
import { FilterList } from 'js/shared-styles/icons';

import { useCellTypesList } from './hooks';
import { PageSectionContainer, CellTypesButton } from './style';

const CellTypesTable = () => {
  const { cellTypes } = useCellTypesList();
  return (
    <PageSectionContainer>
      <CellTypesButton startIcon={<FilterList />}>Additional Filters</CellTypesButton>
      <SearchBarInput placeholder="Search Cell Type" />
      <StyledTable>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Cell Type</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <StyledTableBody>
          {cellTypes?.map((cellType) => (
            <StyledTableRow key={cellType}>
              <StyledTableCell>{cellType}</StyledTableCell>
            </StyledTableRow>
          ))}
        </StyledTableBody>
      </StyledTable>
    </PageSectionContainer>
  );
};

export default CellTypesTable;
