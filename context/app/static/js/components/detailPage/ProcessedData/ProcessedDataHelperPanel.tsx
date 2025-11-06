import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import CloudDownloadRounded from '@mui/icons-material/CloudDownloadRounded';

import { WorkspacesIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { getEntityCreationInfo } from 'js/helpers/functions';

import ProcessedDataGroup from 'js/components/detailPage/ProcessedData/ProcessedDatasetGroup';
import HelperPanel from 'js/shared-styles/HelperPanel';
import StatusIcon from '../StatusIcon';
import { useCurrentDataset } from '../utils';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';
import ProcessedDataWorkspaceMenu from './ProcessedDataWorkspaceMenu';

function Header() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  return (
    <HelperPanel.Header>
      <SchemaRounded fontSize="small" />
      {currentDataset?.hubmap_id}
    </HelperPanel.Header>
  );
}

function Status() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  return (
    <Stack direction="row" alignItems="center">
      <StatusIcon status={currentDataset.status} />
      <Typography variant="body2">{`${currentDataset.status} (${currentDataset.mapped_data_access_level})`}</Typography>
    </Stack>
  );
}

function Body() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  const { creationLabel, creationDate } = getEntityCreationInfo(currentDataset);

  const { title, description, pipeline, assay_display_name, creation_action, group_name } = currentDataset;
  return (
    <>
      {title && (
        <HelperPanel.BodyItem label="Title" noWrap>
          {title}
        </HelperPanel.BodyItem>
      )}
      {description && (
        <HelperPanel.BodyItem label="Description" noWrap>
          {description}
        </HelperPanel.BodyItem>
      )}
      <HelperPanel.BodyItem label="Analysis Type">{pipeline ?? assay_display_name[0]}</HelperPanel.BodyItem>
      <HelperPanel.BodyItem label="Group">
        <ProcessedDataGroup creation_action={creation_action} group_name={group_name} />
      </HelperPanel.BodyItem>
      <HelperPanel.BodyItem label={creationLabel}>{creationDate}</HelperPanel.BodyItem>
    </>
  );
}

function Actions() {
  const currentDataset = useCurrentDataset();
  const track = useTrackEntityPageEvent();
  if (!currentDataset) {
    return null;
  }

  const { hubmap_id, uuid } = currentDataset;

  return (
    <>
      <ProcessedDataWorkspaceMenu
        button={
          <SecondaryBackgroundTooltip title="Launch new workspace or add dataset to an existing workspace.">
            <HelperPanel.Button startIcon={<WorkspacesIcon color="primary" />}>Workspace</HelperPanel.Button>
          </SecondaryBackgroundTooltip>
        }
        hubmap_id={hubmap_id}
        uuid={uuid}
        dialogType="ADD_DATASETS_FROM_HELPER_PANEL"
      />
      <SecondaryBackgroundTooltip title="Scroll down to the Bulk Data Transfer Section.">
        <HelperPanel.Button
          startIcon={<CloudDownloadRounded />}
          href="#bulk-data-transfer"
          onClick={() => {
            track({
              action: 'Navigate to Bulk Download',
              label: currentDataset?.hubmap_id,
            });
          }}
        >
          Bulk Data Transfer
        </HelperPanel.Button>
      </SecondaryBackgroundTooltip>
    </>
  );
}

export default function DatasetHelperPanel({ sectionInView }: { sectionInView?: boolean }) {
  const currentDataset = useCurrentDataset();

  return (
    <HelperPanel shouldDisplay={Boolean(currentDataset && sectionInView)}>
      <Header />
      <Divider />
      <Status />
      <Body />
      <Actions />
    </HelperPanel>
  );
}
