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
// import { useGatewayStatus } from './hooks';

function ServiceStatus() {
  // const gatewayStatus = useGatewayStatus();
  // Blocked by https://github.com/hubmapconsortium/gateway/issues/58

  // TODO: Temporary, to develop UI:
  const gatewayStatus = {
    entity_api: { api_auth: true, build: 'master:da23d1a', neo4j_connection: true, version: '1.8.1' },
    file_assets: { api_auth: true, file_assets_status: true },
    gateway: { build: 'master:53431e4', version: '1.8.1' },
    ingest_api: { api_auth: true, build: 'master:9061dd3', neo4j_connection: true, version: '1.15.0' },
    search_api: {
      api_auth: true,
      build: 'master:69af7d6',
      elasticsearch_connection: true,
      elasticsearch_status: 'green',
      version: '1.8.2',
    },
    uuid_api: { api_auth: true, build: 'master:8e27b2e', mysql_connection: true, version: '1.7.0' },
  };

  const apiStatuses = gatewayStatus
    ? [
        {
          name: 'entity-api',
          github: 'https://github.com/hubmapconsortium/entity-api',
          build: gatewayStatus.entity_api.build,
          version: gatewayStatus.entity_api.version,
          note: `Auth? ${gatewayStatus.entity_api.api_auth}; Neo4j? ${gatewayStatus.entity_api.neo4j_connection}`,
        },
        {
          name: 'assets',
          github: undefined,
          build: 'na',
          version: 'na',
          note: `Auth? ${gatewayStatus.file_assets.api_auth}; Status? ${gatewayStatus.file_assets.file_assets_status}`,
        },
        {
          name: 'gateway',
          github: 'https://github.com/hubmapconsortium/gateway',
          build: gatewayStatus.gateway.build,
          version: gatewayStatus.gateway.version,
          note: '',
        },
        {
          name: 'ingest-api',
          github: 'https://github.com/hubmapconsortium/ingest-api',
          build: gatewayStatus.ingest_api.build,
          version: gatewayStatus.ingest_api.version,
          note: `Auth? ${gatewayStatus.ingest_api.api_auth}; Neo4j? ${gatewayStatus.ingest_api.neo4j_connection}`,
        },
        {
          name: 'search-api',
          github: 'https://github.com/hubmapconsortium/search-api',
          build: gatewayStatus.search_api.build,
          version: gatewayStatus.search_api.version,
          // TODO: Add mapper info here?
          note: `Auth? ${gatewayStatus.search_api.api_auth}; ES? ${gatewayStatus.search_api.elasticsearch_connection}; ES Status? ${gatewayStatus.search_api.elasticsearch_status}`,
        },
        {
          name: 'uuid-api',
          github: 'https://github.com/hubmapconsortium/uuid-api',
          build: gatewayStatus.uuid_api.build,
          version: gatewayStatus.uuid_api.version,
          note: `MySQL? ${gatewayStatus.uuid_api.mysql_connection}`,
        },
      ]
    : [];
  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. '}
          {'The Portal depends directly on only search-api, entity-api, and assets. '}
          {'Other services use the others listed below. '}
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
              <HeaderCell>Note</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiStatuses.map((api) => (
              <TableRow key={api.name}>
                <TableCell>{api.name}</TableCell>
                <TableCell>
                  <StatusIcon status="OK" />
                  TODO
                </TableCell>
                <TableCell>
                  {api.github ? (
                    <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={api.github}>
                      Github Link <StyledExternalLinkIcon />
                    </LightBlueLink>
                  ) : (
                    'none'
                  )}
                </TableCell>
                <TableCell>{api.version}</TableCell>
                <TableCell>{api.build}</TableCell>
                <TableCell>{api.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

export default ServiceStatus;
