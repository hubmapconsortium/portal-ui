import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import SectionHeader from 'js/components/Detail/SectionHeader';
import SectionContainer from 'js/components/Detail/SectionContainer';
import Description from 'js/components/Detail/Description';
import { StyledExternalLinkIcon } from 'js/components/files/GlobusLinkMessage/style';

import { HeaderCell } from 'js/shared-styles/Table';
import { LightBlueLink } from 'js/shared-styles/Links';

import StatusIcon from './StatusIcon';
import { useEntityApiStatus } from './hooks';

function ServiceStatus() {
  const entityApiStatus = useEntityApiStatus();
  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          The HuBMAP Data Portal is powered by a number of APIs. The current status of each is available here, along
          with a link to the source code.
        </Description>
      </SectionContainer>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Service</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Github Repository</HeaderCell>
              <HeaderCell>Version Number</HeaderCell>
              <HeaderCell>Build</HeaderCell>
              <HeaderCell>Notes</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>portal-ui</TableCell>
              <TableCell>
                <StatusIcon status="OK" />
                Available
              </TableCell>
              <TableCell>TODO</TableCell>
              <TableCell>TODO</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>entity-api</TableCell>
              <TableCell>
                <StatusIcon status="OK" />
                Available
              </TableCell>
              <TableCell>
                <LightBlueLink
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  href="https://github.com/hubmapconsortium/entity-api/"
                >
                  Github Link <StyledExternalLinkIcon />
                </LightBlueLink>
              </TableCell>
              <TableCell>{entityApiStatus?.version}</TableCell>
              <TableCell>{entityApiStatus?.build}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default ServiceStatus;
