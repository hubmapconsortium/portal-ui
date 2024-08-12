import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { capitalize } from '@mui/material/utils';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import { useTabs } from 'js/shared-styles/tabs';
import { Tab, Tabs, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { StyledTableContainer } from 'js/shared-styles/tables';
import { InternalLink } from 'js/shared-styles/Links';
import { CellTypeBiomarkerInfo } from 'js/hooks/useUBKG';

import DetailPageSection from '../detailPage/DetailPageSection';
import { useCellTypeBiomarkers } from './hooks';

const tableKeys = ['genes', 'proteins'] as const;
type TableKey = (typeof tableKeys)[number];
interface BiomarkerTableProps {
  tableKey: TableKey;
}

function otherTableKey(tableKey: TableKey): TableKey {
  const otherKey = tableKeys.find((key) => key !== tableKey);
  if (!otherKey) {
    throw new Error(`Could not find other table key for ${tableKey}. This should never happen.`);
  }
  return otherKey;
}

function BiomarkerTableRow({ biomarker, type }: { biomarker: CellTypeBiomarkerInfo; type: TableKey }) {
  const { entry } = biomarker;
  return (
    <TableRow>
      <TableCell>
        <InternalLink href={`/${type}/${entry.symbol}`}>
          {entry.name} ({entry.symbol})
        </InternalLink>
      </TableCell>
      <TableCell>TODO</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>view datasets</TableCell>
    </TableRow>
  );
}

function BiomarkerTable({ tableKey }: BiomarkerTableProps) {
  const data = useCellTypeBiomarkers()[tableKey];
  return (
    <StyledTableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableCell>Name</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Type</TableCell>
          <TableCell aria-label="View Datasets" />
        </TableHead>
        <TableBody>
          {data.map((biomarker) => (
            <BiomarkerTableRow biomarker={biomarker} type={tableKey} key={biomarker.entry.id} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default function CellTypesBiomarkersTable() {
  const { sources, selectedSource, handleSourceSelection, ...biomarkers } = useCellTypeBiomarkers();

  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <DetailPageSection id="biomarkers">
      <SectionHeader>Biomarkers</SectionHeader>
      <Stack direction="column" spacing={2}>
        <Description>
          This is a list of identified biomarkers that are validated from the listed source. Explore other sources in
          dropdown menu below, if available.
        </Description>
        <FormControl fullWidth>
          <InputLabel id="source-select-label" htmlFor="biomarker-source-select">
            Source
          </InputLabel>
          <Select label="Source" id="biomarker-source-select" value={selectedSource} onChange={handleSourceSelection}>
            {sources.map((source) => (
              <MenuItem key={source} value={source}>
                {source}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Tabs value={openTabIndex} onChange={handleTabChange}>
            {tableKeys.map((key, index) => (
              <Tab
                label={`${capitalize(key)} (${biomarkers[key].length})`}
                index={index}
                key={key}
                disabled={biomarkers[key].length === 0}
                isSingleTab={biomarkers[otherTableKey(key)].length === 0}
              />
            ))}
          </Tabs>
          {tableKeys.map((key, index) => (
            <TabPanel value={openTabIndex} index={index} key={key}>
              <BiomarkerTable tableKey={key} />
            </TabPanel>
          ))}
        </div>
      </Stack>
    </DetailPageSection>
  );
}
