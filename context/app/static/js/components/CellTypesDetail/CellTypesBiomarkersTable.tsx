import React from 'react';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTabs } from 'js/shared-styles/tabs';
import { Tab, Tabs, TabPanel } from 'js/shared-styles/tables/TableTabs';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { CellTypeBiomarkerInfo, useCellTypeBiomarkers } from './hooks';
import { DetailPageSection } from '../detailPage/style';

interface BiomarkerTableProps {
  tableKey: 'genes' | 'proteins';
}

function BiomarkerTableRow({ biomarker, type }: { biomarker: CellTypeBiomarkerInfo; type: 'genes' | 'proteins' }) {
  const { entry } = biomarker;
  return (
    <TableRow>
      <TableCell>
        {entry.name} ({entry.symbol})
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
    <Table>
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
  );
}

export default function CellTypesBiomarkersTable() {
  const { genes, proteins, sources, selectedSource, handleSourceSelection } = useCellTypeBiomarkers();

  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <DetailPageSection>
      <SectionHeader>Biomarkers</SectionHeader>
      <Stack direction="column" spacing={2}>
        <Description>
          This is a list of identified biomarkers that are validated from the listed source. Explore other sources in
          dropdown menu below, if available.
        </Description>
        <Select label="Source" value={selectedSource} fullWidth onChange={handleSourceSelection}>
          {sources.map((source) => (
            <MenuItem key={source} value={source}>
              {source}
            </MenuItem>
          ))}
        </Select>
        <Tabs value={openTabIndex} onChange={handleTabChange}>
          <Tab
            label={`Genes (${genes.length})`}
            index={0}
            isSingleTab={proteins.length === 0}
            disabled={genes.length === 0}
          />
          <Tab
            label={`Proteins (${proteins.length})`}
            index={1}
            isSingleTab={genes.length === 0}
            disabled={proteins.length === 0}
          />
        </Tabs>
        <TabPanel value={openTabIndex} index={0}>
          <BiomarkerTable tableKey="genes" />
        </TabPanel>
        <TabPanel value={openTabIndex} index={1}>
          <BiomarkerTable tableKey="proteins" />
        </TabPanel>
      </Stack>
    </DetailPageSection>
  );
}
