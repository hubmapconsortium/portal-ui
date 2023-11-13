import React from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { DetailPageSection } from 'js/components/detailPage/style';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';
import { TableContainer } from '@mui/material';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { StyledTableContainer } from 'js/shared-styles/tables';
import { cellTypes } from '../constants';
import { useGeneDetails } from '../hooks';

const columnLabels = ['Cell Types', 'Description', 'Organs'];

function TableSkeleton() {
  return (
    <>
      <TableRow>
        <TableCell colSpan={columnLabels.length}>
          <LinearProgress />
        </TableCell>
      </TableRow>
      <LoadingTableRows numberOfRows={3} numberOfCols={columnLabels.length} />
    </>
  );
}

export default function CellTypes() {
  const { data, isLoading } = useGeneDetails();

  return (
    <DetailPageSection id={cellTypes.id}>
      <SectionHeader iconTooltipText={cellTypes.tooltip}>{cellTypes.title}</SectionHeader>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnLabels.map((label) => (
                <TableCell key={label}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              data?.cell_types.map((cellType) => (
                <TableRow key={cellType.id}>
                  <TableCell>{cellType.name}</TableCell>
                  <TableCell>{cellType.definition}</TableCell>
                  <TableCell>{cellType.organs.map((o) => o.name).join(',\u00A0') || <>&mdash;</>}</TableCell>
                  {/* <TableCell>
                    <Button startIcon={<entityIconMap.Dataset />} variant="outlined" sx={{ borderRadius: '4px' }}>
                      View&nbsp;Datasets
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </DetailPageSection>
  );
}
