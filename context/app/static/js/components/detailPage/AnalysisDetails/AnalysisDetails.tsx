import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { DagProvenanceType } from 'js/components/types';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import { OutboundLink } from 'js/shared-styles/Links';

interface AnalysisDetails {
  dagListData: DagProvenanceType[];
  workflow_description?: string;
  workflow_version?: string;
}

interface Pipeline {
  documentation_url?: string;
  input_parameters?: {
    parameter_name: string;
    value: string;
  }[];
  hash: string;
  name?: string;
  origin: string;
  version?: string;
}

function WorkflowParameters({ input_parameters }: Required<Pick<Pipeline, 'input_parameters'>>) {
  return (
    <Stack spacing={1} pl={4}>
      <Typography variant="subtitle2">Input Parameters</Typography>
      <Stack spacing={1}>
        {input_parameters.map(({ parameter_name, value }) => (
          <Typography variant="parameters" key={parameter_name} color="secondary">
            {parameter_name} {value}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}

function buildGithubURL(data: DagProvenanceType) {
  const trimmedOrigin = data.origin.replace(/\.git$/, '');
  return 'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
}

function WorkflowStep({ pipeline, i }: { pipeline: Pipeline; i: number }) {
  const { name, origin, input_parameters, documentation_url, hash, version } = pipeline;
  const pipelineName = name ?? origin.split('/').pop();

  const githubUrl = buildGithubURL(pipeline);
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;

  return (
    <ExpandableRow
      numCells={7}
      expandedContent={input_parameters ? <WorkflowParameters input_parameters={input_parameters} /> : null}
      reverse
      disabled={!input_parameters?.length}
    >
      <ExpandableRowCell>{i + 1}</ExpandableRowCell>
      <ExpandableRowCell>
        {pipelineName} {Boolean(version) && `(${version})`}
      </ExpandableRowCell>
      <ExpandableRowCell>
        <OutboundIconLink href={origin}>{origin}</OutboundIconLink>
      </ExpandableRowCell>
      <ExpandableRowCell>
        <Box>
          <OutboundIconLink href={githubUrl}>{hash}</OutboundIconLink>
        </Box>
      </ExpandableRowCell>
      <ExpandableRowCell>
        {documentation_url ? <OutboundLink href={documentation_url}>{documentation_url}</OutboundLink> : '-'}
      </ExpandableRowCell>
      <ExpandableRowCell>
        {cwlUrl.endsWith('cwl') ? (
          <Box>
            <OutboundLinkButton href={cwlUrl} component="a" variant="outlined">
              Open CWL Viewer
            </OutboundLinkButton>
          </Box>
        ) : (
          '-'
        )}
      </ExpandableRowCell>
    </ExpandableRow>
  );
}

const cols = ['Step', 'Tool', 'Origin Link', 'Git Commit', 'Documentation Link', null];

function WorkflowSteps({ steps }: { steps: Pipeline[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: 'background.paper' }}>&nbsp; {/* Expansion cell column */} </TableCell>
          {cols.map((col) => (
            <TableCell sx={{ backgroundColor: 'background.paper' }} key={col}>
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {steps.map((pipeline, i) => (
          <WorkflowStep pipeline={pipeline} i={i} key={pipeline.origin + pipeline.hash + pipeline.version} />
        ))}
      </TableBody>
    </Table>
  );
}

function AnalysisDetails({ dagListData, workflow_description, workflow_version }: AnalysisDetails) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Workflow (v{workflow_version})</Typography>
      <Typography>{workflow_description}</Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <InfoIcon sx={{ fontSize: '1rem' }} color="primary" />
        <Typography>These are the steps executed in the workflow to produce the processed dataset.</Typography>
      </Stack>
      <WorkflowSteps steps={dagListData} />
    </Stack>
  );
}

export default AnalysisDetails;
