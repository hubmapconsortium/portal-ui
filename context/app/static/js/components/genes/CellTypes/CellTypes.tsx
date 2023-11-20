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

function OrgansCell({ organs }: { organs: { name: string }[] }) {
  const contents = !organs ? (
    <>&mdash;</>
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
                  <TableCell>
                    <LineClamp lines={2}>{cellType.definition}</LineClamp>
                  </TableCell>
                  <OrgansCell organs={cellType.organs} />
                  <TableCell>
                    <ViewDatasets id={cellType.id} name={cellType.name} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </DetailPageSection>
  );
}
