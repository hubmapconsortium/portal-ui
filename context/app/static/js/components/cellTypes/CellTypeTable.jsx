import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';

import {
  StyledTable,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
} from 'js/components/searchPage/ResultsTable/style';
import SearchBarInput from 'js/shared-styles/inputs/SearchBar';
import { FilterList } from 'js/shared-styles/icons';

import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { useCellTypesList } from './hooks';
import { PageSectionContainer, CellTypesButton } from './style';
import CellTypeRow from './CellTypeRow';

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
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Organs</StyledTableCell>
            <StyledTableCell>Assays</StyledTableCell>
            <StyledTableCell>
              <Typography variant="srOnly">Datasets</Typography>
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <StyledTableBody>
          {cellTypes?.map((cellType) => (
            <CellTypeRow key={cellType} cellType={cellType} />
          ))}
          {!cellTypes && <TablePlaceholder />}
        </StyledTableBody>
      </StyledTable>
    </PageSectionContainer>
  );
};

const placeholderArray = new Array(10).fill(0);

const TablePlaceholder = () =>
  placeholderArray.map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <StyledTableRow key={index}>
      <StyledTableCell colSpan={5}>
        <Skeleton variant="text" width="100%" />
      </StyledTableCell>
    </StyledTableRow>
  ));

export default CellTypesTable;
