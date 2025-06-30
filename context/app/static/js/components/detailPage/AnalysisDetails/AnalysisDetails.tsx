import React, { useCallback, useState, Dispatch, SetStateAction } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import Paper from '@mui/material/Paper';

import { DagProvenanceType } from 'js/components/types';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import OutboundLinkButton from 'js/shared-styles/Links/OutboundLinkButton';
import { OutboundLink } from 'js/shared-styles/Links';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledTableContainer } from 'js/shared-styles/tables';

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
  const copyText = useHandleCopyClick();

  const copyParametersText = useCallback(() => {
    const text = input_parameters.reduce<string>((acc, { parameter_name, value }) => {
      const param = [parameter_name, value].join(' ');

      return [acc, param].join('\n');
    }, '');
    copyText(text);
  }, [input_parameters, copyText]);

  return (
    <Stack spacing={1} pl={4} mb={1}>
      <Stack direction="row" spacing="1" alignItems="center">
        <Typography variant="subtitle2">Input Parameters</Typography>
        <Box>
          <SecondaryBackgroundTooltip title="Copy input parameters to clipboard.">
            <IconButton onClick={copyParametersText}>
              <ContentCopyIcon color="primary" sx={{ fontSize: '1rem' }} />
            </IconButton>
          </SecondaryBackgroundTooltip>
        </Box>
      </Stack>
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

function WorkflowStep({
  pipeline,
  i,
  setRowIsExpanded,
}: {
  pipeline: Pipeline;
  i: number;
  setRowIsExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  const { name, origin, input_parameters, documentation_url, hash, version } = pipeline;
  const pipelineName = name ?? origin.split('/').pop();

  const githubUrl = buildGithubURL(pipeline);
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;

  const onExpand = useCallback(
    (isExpanded: boolean) => {
      if (isExpanded) {
        setRowIsExpanded(true);
      }
    },
    [setRowIsExpanded],
  );

  return (
    <ExpandableRow
      numCells={7}
      expandedContent={input_parameters ? <WorkflowParameters input_parameters={input_parameters} /> : null}
      reverse
      disabled={!input_parameters?.length}
      onExpand={onExpand}
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
            <OutboundLinkButton href={cwlUrl} component="a" variant="outlined" color="info">
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

function createPipelineKey({ name, hash, origin, version }: Pipeline) {
  return [name, hash, origin, version].join();
}

const cols = ['Step', 'Tool', 'Origin Link', 'Git Commit', 'Documentation Link', null];

function WorkflowSteps({
  steps,
  setRowIsExpanded,
}: {
  steps: Pipeline[];
  setRowIsExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <StyledTableContainer component={Paper} maxHeight={550}>
      <Table stickyHeader>
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
            <WorkflowStep
              pipeline={pipeline}
              i={i}
              setRowIsExpanded={setRowIsExpanded}
              key={createPipelineKey({
                name: pipeline.name,
                origin: pipeline.origin,
                hash: pipeline.hash,
                version: pipeline.version,
              })}
            />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

function dedupeSteps(steps: Pipeline[]) {
  const stepMap = steps.reduce<Record<string, Pipeline>>((acc, curr) => {
    const { name, hash, origin, version } = curr;

    const key = createPipelineKey({ name, hash, origin, version });

    if (!(key in acc)) {
      acc[key] = curr;
    }

    return acc;
  }, {});

  return Object.values(stepMap);
}

function AnalysisDetails({ dagListData, workflow_description, workflow_version }: AnalysisDetails) {
  const dedupedSteps = dedupeSteps(dagListData);

  // Change the key of the workflow steps component to get around localized expandable row contexts.
  const [resetExpandedKey, setResetExpandedKey] = useState(false);
  const [rowIsExpanded, setRowIsExpanded] = useState(false);
  const collapseSteps = useCallback(() => {
    setRowIsExpanded((prev) => !prev);
    setResetExpandedKey((prev) => !prev);
  }, [setResetExpandedKey, setRowIsExpanded]);

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Workflow (v{workflow_version})</Typography>
      <Typography>{workflow_description}</Typography>
      <Box>
        <Button variant="outlined" onClick={collapseSteps} disabled={!rowIsExpanded}>
          <VisibilityOffRoundedIcon sx={{ marginRight: 1, fontSize: '1.125rem' }} />
          Collapse Steps ({dedupedSteps.length})
        </Button>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <InfoIcon sx={{ fontSize: '1rem' }} color="primary" />
        <Typography>These are the steps executed in the workflow to produce the processed dataset.</Typography>
      </Stack>
      <WorkflowSteps
        steps={dedupedSteps}
        setRowIsExpanded={setRowIsExpanded}
        key={['workflow-steps', resetExpandedKey.toString()].join('-')}
      />
    </Stack>
  );
}

export default AnalysisDetails;
