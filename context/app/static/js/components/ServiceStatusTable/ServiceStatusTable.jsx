import React, { useContext } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { version } from 'package';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { AppContext } from 'js/components/Providers';
import { StyledExternalLinkIcon } from 'js/components/files/GlobusLinkMessage/style';
import { HeaderCell } from 'js/shared-styles/Table';

import StatusIcon from './StatusIcon';
import { useGatewayStatus } from './hooks';
import { buildServiceStatus } from './utils';

function ServiceStatusTable() {
  const { elasticsearchEndpoint, assetsEndpoint, entityEndpoint } = useContext(AppContext);
  const gatewayStatus = useGatewayStatus();

  const apiStatuses = gatewayStatus
    ? [
        buildServiceStatus({
          apiName: 'assets',
          endpointUrl: assetsEndpoint,
          response: gatewayStatus.file_assets,
          noteFunction: (api) => `Status: ${api.file_assets_status}`,
        }),
        buildServiceStatus({
          apiName: 'entity-api',
          endpointUrl: entityEndpoint,
          response: gatewayStatus.entity_api,
          noteFunction: (api) => `Neo4j: ${api.neo4j_connection}`,
        }),
        buildServiceStatus({ apiName: 'gateway', response: gatewayStatus.gateway, noteFunction: () => '' }),
        buildServiceStatus({
          apiName: 'ingest-ui',
          response: gatewayStatus.ingest_api,
          noteFunction: (api) => `Neo4j: ${api.neo4j_connection}`,
        }),
        {
          apiName: 'portal-ui',
          github: 'https://github.com/hubmapconsortium/portal-ui',
          // build: Not distinct from version.
          version,
          isUp: true,
        },
        buildServiceStatus({
          apiName: 'search-api',
          endpointUrl: elasticsearchEndpoint,
          response: gatewayStatus.search_api,
          noteFunction: (api) => `ES: ${api.elasticsearch_connection}; ES Status: ${api.elasticsearch_status}`,
        }),
        buildServiceStatus({
          apiName: 'uuid-api',
          response: gatewayStatus.uuid_api,
          noteFunction: (api) => `MySQL: ${api.mysql_connection}`,
        }),
      ]
    : [];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Service</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Endpoint</HeaderCell>
          <HeaderCell>Github Repository</HeaderCell>
          <HeaderCell>Version Number</HeaderCell>
          <HeaderCell>Build</HeaderCell>
          <HeaderCell>Note</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {apiStatuses.map((api) => (
          <TableRow key={api.apiName}>
            <TableCell>{api.apiName}</TableCell>
            <TableCell>
              <StatusIcon isUp={api.isUp} />
            </TableCell>
            <TableCell>{api.endpointUrl}</TableCell>
            <TableCell>
              {api.github && (
                <OutboundLink underline="none" href={api.github}>
                  Github Link <StyledExternalLinkIcon />
                </OutboundLink>
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
