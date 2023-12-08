import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import React, { Fragment } from 'react';
import Description from 'js/shared-styles/sections/Description';
import { useTabs } from 'js/shared-styles/tabs';
import { StyledTableContainer } from 'js/shared-styles/tables';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import format from 'date-fns/format';
import { InternalLink } from 'js/shared-styles/Links';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DetailPageSection } from '../detailPage/style';
import { useCellTypeSamples, useCellTypeDatasets, useCellTypeOrgans } from './hooks';

export default function CellTypesEntitiesTables() {
  const { data: datasets } = useCellTypeDatasets();
  const { data: samples } = useCellTypeSamples();
  const { data: organs } = useCellTypeOrgans();

  const { openTabIndex, handleTabChange } = useTabs();
  return (
    <DetailPageSection id="organs">
      <SectionHeader>Organs</SectionHeader>
      <Description>
        This is the list of organs and its associated data that is dependent on the data available within HuBMAP. To
        filter the list of data in the table below by organ, select organ(s) from the list below. Multiple organs can be
        selected.
      </Description>
      <Stack direction="row" spacing={2} useFlexGap>
        {organs?.map(({ organ }) => organ).join(',')}
      </Stack>
      <Tabs value={openTabIndex} onChange={handleTabChange}>
        <Tab index={0} label={`Samples (${samples?.length ?? 0})`} />
        <Tab index={1} label={`Datasets (${datasets?.length ?? 0})`} />
      </Tabs>
      <TabPanel index={0} value={openTabIndex}>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>HuBMAP ID</TableCell>
                <TableCell>Organ</TableCell>
                <TableCell>Sample Category</TableCell>
                <TableCell>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samples?.map((sample) => (
                <TableRow key={sample.hubmap_id}>
                  <TableCell>
                    <InternalLink href={`/browse/${sample.hubmap_id}`}>{sample.hubmap_id}</InternalLink>
                  </TableCell>
                  <TableCell>{sample.organ}</TableCell>
                  <TableCell>{sample.sample_category}</TableCell>
                  <TableCell>{format(sample.last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </TabPanel>
      <TabPanel index={1} value={openTabIndex}>
        <StyledTableContainer component={Paper}>
          {datasets?.map((dataset, idx) => (
            <Fragment key={dataset}>
              <InternalLink href={`/browse/dataset/${dataset}`}>{dataset}</InternalLink>
              {idx !== datasets.length - 1 && <br />}
            </Fragment>
          ))}
        </StyledTableContainer>
      </TabPanel>
    </DetailPageSection>
  );
}
