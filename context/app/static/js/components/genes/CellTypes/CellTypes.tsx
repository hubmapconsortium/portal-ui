import React from 'react';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';

import { DetailPageSection } from 'js/components/detailPage/style';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import { cellTypes } from '../constants';
import { useGeneDetails } from '../hooks';

const columnLabels = ['Cell Types', 'Description', 'Organs'];

export default function CellTypes() {
  const { data, isLoading } = useGeneDetails();

  return (
    <DetailPageSection id={cellTypes.id}>
      <SectionHeader iconTooltipText={cellTypes.tooltip}>{cellTypes.title}</SectionHeader>
      <Table>
        <TableHead>
          <TableRow>
            {columnLabels.map((label) => (
              <TableCell key={label}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columnLabels.length}>
                <LinearProgress />
              </TableCell>
            </TableRow>
          ) : (
            data?.cell_types.map((cellType) => (
              <TableRow key={cellType.id}>
                <TableCell>{cellType.name}</TableCell>
                <TableCell>{cellType.definition}</TableCell>
                <TableCell>{cellType.organs.join(', ')}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DetailPageSection>
  );
}
