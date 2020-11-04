import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledExternalLinkIcon } from 'js/components/files/GlobusLinkMessage/style';

import { HeaderCell } from 'js/shared-styles/Table';
import { LightBlueLink } from 'js/shared-styles/Links';

import { version } from 'package';
import StatusIcon from './StatusIcon';
import { useGatewayStatus } from './hooks';
import { buildServiceStatus } from './utils';

function ServiceStatusTable() {
  const gatewayStatus = useGatewayStatus();

  const apiStatuses = gatewayStatus
    ? [
        buildServiceStatus('assets', gatewayStatus.file_assets, (api) => `Status: ${api.file_assets_status}`),
        buildServiceStatus('entity-api', gatewayStatus.entity_api, (api) => `Neo4j: ${api.neo4j_connection}`),
        buildServiceStatus('gateway', gatewayStatus.gateway, () => ''),
        buildServiceStatus('ingest-ui', gatewayStatus.ingest_api, (api) => `Neo4j: ${api.neo4j_connection}`),
        {
          name: 'portal-ui',
          github: 'https://github.com/hubmapconsortium/portal-ui',
          // build: Not distinct from version.
          version,
          isUp: true,
        },
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
              <StatusIcon isUp={api.isUp} />
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
