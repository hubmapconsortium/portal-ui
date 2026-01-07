import withShouldDisplay from 'js/helpers/withShouldDisplay';
import AnalysisDetails from './AnalysisDetails';
import React from 'react';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import Protocol from '../Protocol';
import { Dataset } from 'js/components/types';
import Description from 'js/shared-styles/sections/Description';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';

interface AnalysisDetailsSectionProps {
  isExternal?: boolean;
  protocolUrl?: string;
  dataset?: Dataset;
}

function AnalysisDetailsWrapper({ isExternal, dataset }: Pick<AnalysisDetailsSectionProps, 'isExternal' | 'dataset'>) {
  if (isExternal) {
    return null;
  }
  if (!dataset) {
    return <Skeleton variant="rectangular" height={200} />;
  }
  const { ingest_metadata } = dataset;
  const { workflow_description, workflow_version, dag_provenance_list } = ingest_metadata || {};

  if (!dag_provenance_list) {
    return <Description>Analysis details are not available for this dataset.</Description>;
  }

  return (
    <AnalysisDetails
      dagListData={dag_provenance_list}
      workflow_version={workflow_version}
      workflow_description={workflow_description}
    />
  );
}

function AnalysisDetailsSection({ isExternal, protocolUrl, dataset }: AnalysisDetailsSectionProps) {
  return (
    <CollapsibleDetailPageSection
      id="protocols-&-workflow-details"
      title="Protocols & Workflow Details"
      icon={sectionIconMap['protocols-&-workflow-details']}
    >
      <Paper sx={{ px: 2, py: 1 }}>
        {protocolUrl && <Protocol protocol_url={protocolUrl} />}
        <AnalysisDetailsWrapper isExternal={isExternal} dataset={dataset} />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(AnalysisDetailsSection);
