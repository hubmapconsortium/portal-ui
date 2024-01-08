import React, { Fragment } from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';

import { DetailPageSection } from 'js/components/detailPage/style';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';
import { StyledTableContainer } from 'js/shared-styles/tables';
import { LineClamp } from 'js/shared-styles/text';
import { InternalLink } from 'js/shared-styles/Links';
import { cellTypes } from '../constants';
import { useGeneDetails } from '../hooks';
import ViewDatasets from './ViewDatasets';
import { CellTypeInfo } from '../types';

const columnLabels = ['Cell Types', 'Description', 'Organs', ''];

export function TableSkeleton({ numberOfCols = columnLabels.length }: { numberOfCols?: number }) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={numberOfCols}>
          <LinearProgress />
        </TableCell>
      </TableRow>
      <LoadingTableRows numberOfRows={3} numberOfCols={numberOfCols} />
    </>
  );
}

function EmptyCellFallback() {
  return <>&mdash;</>;
}

function OrgansCell({ organs }: { organs: { name: string }[] }) {
  const contents = !organs ? (
    <EmptyCellFallback />
  ) : (
    organs.map(({ name }, i) => (
      <Fragment key={name}>
        <InternalLink href={`/organ/${name}`}>{name}</InternalLink>
        {i < organs.length - 1 && ', '}
      </Fragment>
    ))
  );

  return <TableCell sx={{ whiteSpace: 'nowrap' }}>{contents}</TableCell>;
}

function CellTypesRow({ cellType }: { cellType: CellTypeInfo }) {
  return (
    <TableRow>
      <TableCell>{cellType.name}</TableCell>
      <TableCell>
        <LineClamp lines={2}>{cellType.definition}</LineClamp>
      </TableCell>
      <OrgansCell organs={cellType.organs} />
      <TableCell>
        <ViewDatasets id={cellType.id} name={cellType.name} />
      </TableCell>
    </TableRow>
  );
}

function CellTypesTable() {
  const { data, isLoading } = useGeneDetails();

  if (!isLoading && data?.cell_types.length === 0) {
    return 'No cell types found.';
  }

  return (
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
            data?.cell_types.map((cellType) => <CellTypesRow key={cellType.id} cellType={cellType} />)
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default function CellTypes() {
  return (
    <DetailPageSection id={cellTypes.id}>
      <SectionHeader iconTooltipText={cellTypes.tooltip}>{cellTypes.title}</SectionHeader>
      <CellTypesTable />
    </DetailPageSection>
  );
}
