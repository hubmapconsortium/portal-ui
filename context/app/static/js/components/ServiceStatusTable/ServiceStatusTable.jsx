import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledExternalLinkIcon } from 'js/components/files/GlobusLinkMessage/style';

import { HeaderCell } from 'js/shared-styles/Table';
import { LightBlueLink } from 'js/shared-styles/Links';

import StatusIcon from './StatusIcon';
import { useGatewayStatus } from './hooks';

function buildServiceStatus(name, response, noteFunc) {
  const { build, version, api_auth } = response;
  const isUp = api_auth || name === 'gateway';
  // The gateway isn't explicit: If it's not up, you wouldn't get anything at all,
  // (and you wouldn't be able to get to the portal in the first place.)
  return {
    name,
    github: build ? `https://github.com/hubmapconsortium/${name}` : undefined,
    build,
    version,
    isUp,
    note: noteFunc(response),
  };
}

function ServiceStatusTable() {
  const gatewayStatus = useGatewayStatus();

  const apiStatuses = gatewayStatus
    ? [
        buildServiceStatus('assets', gatewayStatus.file_assets, (api) => `Status: ${api.file_assets_status}`),
        buildServiceStatus('entity-api', gatewayStatus.entity_api, (api) => `Neo4j: ${api.neo4j_connection}`),
        buildServiceStatus('gateway', gatewayStatus.gateway, () => ''),
        buildServiceStatus('ingest-api', gatewayStatus.ingest_api, (api) => `Neo4j: ${api.neo4j_connection}`),
        buildServiceStatus(
          'search-api',
          gatewayStatus.search_api,
          (api) => `ES: ${api.elasticsearch_connection}; ES Status: ${api.elasticsearch_status}`,
        ),
        buildServiceStatus('uuid-api', gatewayStatus.uuid_api, (api) => `MySQL: ${api.mysql_connection}`),
      ]
    : [];

  return (
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
              {api.isUp ? (
                <>
                  <StatusIcon status="UP" />
                  Up
                </>
              ) : (
                <>
                  <StatusIcon status="DOWN" />
                  Down
                </>
              )}
            </TableCell>
            <TableCell>
              {api.github && (
                <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={api.github}>
                  Github Link <StyledExternalLinkIcon />
                </LightBlueLink>
              )}
            </TableCell>
            <TableCell>{api.version}</TableCell>
            <TableCell>{api.build}</TableCell>
            <TableCell>{api.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ServiceStatusTable;
