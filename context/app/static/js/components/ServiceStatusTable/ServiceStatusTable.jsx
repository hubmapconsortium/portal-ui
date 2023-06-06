import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import packageInfo from 'package';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { StyledExternalLinkIcon } from 'js/components/detailPage/files/GlobusLinkMessage/style';
import { HeaderCell } from 'js/shared-styles/tables';

import StatusIcon from './StatusIcon';
import { useGatewayStatus } from './hooks';

function buildServiceStatus(args) {
  const { apiName, endpointUrl, githubUrl, response = {}, noteFunction = () => '' } = args;
  const { build, version: apiVersion } = response;
  const isUp = Boolean(Object.keys(response).length);
  // The gateway is implicit: If it's not up, you wouldn't get anything at all,
  // (and you wouldn't be able to get to the portal in the first place.)
  return {
    apiName,
    endpointUrl,
    githubUrl: githubUrl || (build ? `https://github.com/hubmapconsortium/${apiName}` : undefined),
    build,
    apiVersion,
    isUp,
    note: noteFunction(response),
  };
}

function ServiceStatusTable({
  elasticsearchEndpoint,
  assetsEndpoint,
  xmodalityEndpoint,
  entityEndpoint,
  gatewayEndpoint,
  workspacesEndpoint,
  typeServiceEndpoint,
}) {
  const gatewayStatus = useGatewayStatus(`${gatewayEndpoint}/status.json`);

  const apiStatuses = gatewayStatus
    ? [
        buildServiceStatus({
          apiName: 'assets',
          endpointUrl: assetsEndpoint,
          response: gatewayStatus.file_assets,
          noteFunction: (api) => `Status: ${api.file_assets_status}`,
        }),
        buildServiceStatus({
          apiName: 'cells',
          githubUrl: 'https://github.com/hubmapconsortium/cross_modality_query',
          endpointUrl: xmodalityEndpoint,
          response: gatewayStatus.cells_api,
          noteFunction: (api) => `Branch: ${api.branch}; Commit ${api.commit.slice(0, 12)}`,
        }),
        buildServiceStatus({
          apiName: 'entity-api',
          endpointUrl: entityEndpoint,
          response: gatewayStatus.entity_api,
          noteFunction: (api) => `Neo4j: ${api.neo4j_connection} [Note: Internally, Entity API depends on UUID API.]`,
        }),
        buildServiceStatus({
          apiName: 'gateway',
          endpointUrl: gatewayEndpoint,
          response: gatewayStatus.gateway,
        }),
        buildServiceStatus({
          apiName: 'ingest-api',
          response: gatewayStatus.ingest_api,
          noteFunction: (api) => `Neo4j: ${api.neo4j_connection}`,
        }),
        {
          apiName: 'portal-ui',
          githubUrl: 'https://github.com/hubmapconsortium/portal-ui',
          // build: Not distinct from version.
          apiVersion: packageInfo.version,
          isUp: true,
        },
        buildServiceStatus({
          apiName: 'search-api',
          endpointUrl: elasticsearchEndpoint,
          response: gatewayStatus.search_api,
          noteFunction: (api) => `ES: ${api.elasticsearch_connection}; ES Status: ${api.elasticsearch_status}`,
        }),
        buildServiceStatus({
          apiName: 'type-api',
          githubUrl: 'https://github.com/dbmi-pitt/search-adaptor',
          endpointUrl: typeServiceEndpoint,
          response: gatewayStatus.search_api,
          noteFunction: () => 'Included in search-api for historical reasons.',
        }),
        buildServiceStatus({
          apiName: 'uuid-api',
          response: gatewayStatus.uuid_api,
          noteFunction: (api) => `MySQL: ${api.mysql_connection}`,
        }),
        buildServiceStatus({
          apiName: 'workspaces-api',
          response: gatewayStatus.workspaces_api,
          endpointUrl: workspacesEndpoint,
          githubUrl: 'https://github.com/hubmapconsortium/user_workspaces_server',
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
        {apiStatuses.map(({ apiName, isUp, endpointUrl, githubUrl, apiVersion, build, note }) => (
          <TableRow key={apiName}>
            <TableCell>{apiName}</TableCell>
            <TableCell>{typeof isUp === 'undefined' ? 'unknown' : <StatusIcon isUp={isUp} />}</TableCell>
            <TableCell>{endpointUrl || 'not referenced by portal'}</TableCell>
            <TableCell>
              {githubUrl ? (
                <OutboundLink underline="none" href={githubUrl}>
                  {githubUrl.split('/').pop()} <StyledExternalLinkIcon />
                </OutboundLink>
              ) : (
                'n/a'
              )}
            </TableCell>
            <TableCell>{apiVersion || 'n/a'}</TableCell>
            <TableCell>{build || 'n/a'}</TableCell>
            <TableCell>{note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ServiceStatusTable;
