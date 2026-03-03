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

interface AnalysisDetailsProps {
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

function buildGithubAndCwlURL(data: DagProvenanceType) {
  const trimmedOrigin = data.origin.replace(/\.git$/, '');

  const githubUrl =
    'name' in data ? `${trimmedOrigin}/blob/${data.hash}/${data.name}` : `${trimmedOrigin}/tree/${data.hash}`;
  const cwlUrl = `https://view.commonwl.org/workflows/${githubUrl.replace(/^http(s?):\/\//i, '')}`;

  return { githubUrl, cwlUrl };
}

function WorkflowCells({
  stepNumber,
  version,
  hash,
  documentation_url,
  pipelineName,
  githubUrl,
  cwlUrl,
  origin,
  cellComponent: CellComponent,
}: Pick<Pipeline, 'origin' | 'version' | 'hash' | 'documentation_url'> & {
  cellComponent: typeof TableCell | typeof ExpandableRowCell;
  stepNumber: number;
  pipelineName?: string;
  githubUrl: string;
  cwlUrl: string;
}) {
  return (
    <>
      <CellComponent>{stepNumber}</CellComponent>
      <CellComponent>
        {pipelineName} {Boolean(version) && `(${version})`}
      </CellComponent>
      <CellComponent>
        <OutboundIconLink href={origin}>{origin}</OutboundIconLink>
      </CellComponent>
      <CellComponent>
        <Box>
          <OutboundIconLink href={githubUrl}>{hash}</OutboundIconLink>
        </Box>
      </CellComponent>
      <CellComponent>
        {documentation_url ? <OutboundLink href={documentation_url}>{documentation_url}</OutboundLink> : '-'}
      </CellComponent>
      <CellComponent>
        {cwlUrl.endsWith('cwl') ? (
          <Box>
            <OutboundLinkButton href={cwlUrl} component="a" variant="outlined" color="info">
              Open CWL Viewer
            </OutboundLinkButton>
          </Box>
        ) : (
          '-'
        )}
      </CellComponent>
    </>
  );
}

function WorkflowStep({
  pipelineKey,
  pipeline,
  stepNumber,
  setExpandedRows,
}: {
  pipelineKey: string;
  pipeline: Pipeline;
  stepNumber: number;
  setExpandedRows: Dispatch<SetStateAction<Record<string, boolean>>>;
}) {
  const { name, origin, input_parameters, documentation_url, hash, version } = pipeline;
  const pipelineName = name ?? origin.split('/').pop();
  const { githubUrl, cwlUrl } = buildGithubAndCwlURL(pipeline);

  const onExpand = useCallback(
    (isExpanded: boolean) => {
      if (isExpanded) {
        setExpandedRows((prev) => ({ [pipelineKey]: true, ...prev }));
      } else {
        setExpandedRows((prev) => {
          const previousState = prev;
          delete previousState[pipelineKey];
          return { ...previousState };
        });
      }
    },
    [setExpandedRows, pipelineKey],
  );

  if (input_parameters?.length) {
    return (
      <ExpandableRow
        numCells={7}
        expandedContent={input_parameters ? <WorkflowParameters input_parameters={input_parameters} /> : null}
        reverse
        onExpand={onExpand}
      >
        <WorkflowCells
          origin={origin}
          cellComponent={ExpandableRowCell}
          stepNumber={stepNumber}
          version={version}
          hash={hash}
          documentation_url={documentation_url}
          pipelineName={pipelineName}
          githubUrl={githubUrl}
          cwlUrl={cwlUrl}
        />
      </ExpandableRow>
    );
  }

  return (
    <TableRow>
      <TableCell />
      <WorkflowCells
        origin={origin}
        cellComponent={TableCell}
        stepNumber={stepNumber}
        version={version}
        hash={hash}
        documentation_url={documentation_url}
        pipelineName={pipelineName}
        githubUrl={githubUrl}
        cwlUrl={cwlUrl}
      />
    </TableRow>
  );
}

function createPipelineKey({ name, hash, origin, version }: Pipeline) {
  return [name, hash, origin, version].join();
}

const cols = ['Step', 'Tool', 'Origin Link', 'Git Commit', 'Documentation Link', null];

function WorkflowSteps({
  steps,
  setExpandedRows,
}: {
  steps: Pipeline[];
  setExpandedRows: Dispatch<SetStateAction<Record<string, boolean>>>;
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
          {steps.map((pipeline, i) => {
            const pipelineKey = createPipelineKey(pipeline);

            return (
              <WorkflowStep
                pipeline={pipeline}
                stepNumber={i + 1}
                setExpandedRows={setExpandedRows}
                key={pipelineKey}
                pipelineKey={pipelineKey}
              />
            );
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

function dedupeSteps(steps: Pipeline[]) {
  const reducedSteps = steps.reduce<{ uniqueSteps: Record<string, Pipeline>; hasInputParameters: boolean }>(
    (acc, curr) => {
      const { name, hash, origin, version, input_parameters } = curr;

      const key = createPipelineKey({ name, hash, origin, version });

      if (!(key in acc.uniqueSteps)) {
        acc.uniqueSteps[key] = curr;
      }

      if (input_parameters) {
        acc.hasInputParameters = true;
      }

      return acc;
    },
    { uniqueSteps: {}, hasInputParameters: false },
  );

  return { dedupedSteps: Object.values(reducedSteps.uniqueSteps), hasInputParameters: reducedSteps.hasInputParameters };
}

function AnalysisDetails({ dagListData, workflow_description, workflow_version }: AnalysisDetailsProps) {
  const { dedupedSteps, hasInputParameters } = dedupeSteps(dagListData);

  // Change the key of the workflow steps component to get around localized expandable row contexts.
  const [resetExpandedKey, setResetExpandedKey] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const collapseSteps = useCallback(() => {
    setExpandedRows({});
    setResetExpandedKey((prev) => !prev);
  }, [setResetExpandedKey, setExpandedRows]);

  return (
    <Stack spacing={1}>
      {workflow_version && <Typography variant="subtitle2">Workflow (v{workflow_version})</Typography>}
      {workflow_description && <Typography>{workflow_description}</Typography>}
      {hasInputParameters && (
        <Box>
          <Button variant="outlined" onClick={collapseSteps} disabled={Object.keys(expandedRows).length === 0}>
            <VisibilityOffRoundedIcon sx={{ marginRight: 1, fontSize: '1.125rem' }} />
            Collapse Steps ({dedupedSteps.length})
          </Button>
        </Box>
      )}
      <Stack direction="row" alignItems="center" spacing={1}>
        <InfoIcon sx={{ fontSize: '1rem' }} color="primary" />
        <Typography>These are the steps executed in the workflow to produce the processed dataset.</Typography>
      </Stack>
      <WorkflowSteps
        steps={dedupedSteps}
        setExpandedRows={setExpandedRows}
        key={['workflow-steps', resetExpandedKey.toString()].join('-')}
      />
    </Stack>
  );
}

export default AnalysisDetails;
