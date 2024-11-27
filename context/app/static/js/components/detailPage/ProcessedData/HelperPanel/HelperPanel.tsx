import React, { PropsWithChildren } from 'react';
import { animated } from '@react-spring/web';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import CloudDownloadRounded from '@mui/icons-material/CloudDownloadRounded';

import { useIsLargeDesktop } from 'js/hooks/media-queries';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import { useAnimatedSidebarPosition } from 'js/shared-styles/sections/TableOfContents/hooks';
import { LineClampWithTooltip } from 'js/shared-styles/text';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { getEntityCreationInfo } from 'js/helpers/functions';

import ProcessedDataGroup from 'js/components/detailPage/ProcessedData/ProcessedDatasetGroup';
import { HelperPanelPortal } from '../../DetailLayout/DetailLayout';
import StatusIcon from '../../StatusIcon';
import { useCurrentDataset } from '../../utils';
import { HelperPanelButton } from './styles';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';
import ProcessedDataWorkspaceMenu from '../ProcessedDataWorkspaceMenu';

function HelperPanelHeader() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" gap={0.5} whiteSpace="nowrap">
      <SchemaRounded fontSize="small" />
      {currentDataset?.hubmap_id}
    </Typography>
  );
}

function HelperPanelStatus() {
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

interface HelperPanelBodyItemProps extends PropsWithChildren {
  label: string;
  noWrap?: boolean;
}

function HelperPanelBodyItem({ label, children, noWrap }: HelperPanelBodyItemProps) {
  const body = noWrap ? <LineClampWithTooltip lines={3}>{children}</LineClampWithTooltip> : children;
  return (
    <Stack direction="column">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body2">{body}</Typography>
    </Stack>
  );
}

function HelperPanelBody() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  const { creationLabel, creationDate } = getEntityCreationInfo(currentDataset);

  const { title, description, pipeline, assay_display_name, creation_action, group_name } = currentDataset;
  return (
    <>
      {title && (
        <HelperPanelBodyItem label="Title" noWrap>
          {title}
        </HelperPanelBodyItem>
      )}
      {description && (
        <HelperPanelBodyItem label="Description" noWrap>
          {description}
        </HelperPanelBodyItem>
      )}
      <HelperPanelBodyItem label="Analysis Type">{pipeline ?? assay_display_name[0]}</HelperPanelBodyItem>
      <HelperPanelBodyItem label="Group">
        <ProcessedDataGroup creation_action={creation_action} group_name={group_name} />
      </HelperPanelBodyItem>
      <HelperPanelBodyItem label={creationLabel}>{creationDate}</HelperPanelBodyItem>
    </>
  );
}

function HelperPanelActions() {
  const currentDataset = useCurrentDataset();
  const track = useTrackEntityPageEvent();
  if (!currentDataset) {
    return null;
  }

  const { hubmap_id, uuid, status, mapped_data_access_level } = currentDataset;

  return (
    <>
      <ProcessedDataWorkspaceMenu
        button={
          <SecondaryBackgroundTooltip title="Launch new workspace or add dataset to an existing workspace.">
            <HelperPanelButton startIcon={<WorkspacesIcon color="primary" />}>Workspace</HelperPanelButton>
          </SecondaryBackgroundTooltip>
        }
        datasetDetails={{ hubmap_id, uuid, status, mapped_data_access_level }}
        dialogType="ADD_DATASETS_FROM_HELPER_PANEL"
      />
      <SecondaryBackgroundTooltip title="Scroll down to the Bulk Data Transfer Section.">
        <HelperPanelButton
          startIcon={<CloudDownloadRounded />}
          href="#bulk-data-transfer"
          onClick={() => {
            track({
              action: 'Navigate to Bulk Download',
              label: currentDataset?.hubmap_id,
            });
          }}
        >
          Bulk Download
        </HelperPanelButton>
      </SecondaryBackgroundTooltip>
    </>
  );
}

const AnimatedStack = animated(Stack);

export default function HelperPanel() {
  const currentDataset = useCurrentDataset();
  const isDesktop = useIsLargeDesktop();
  const style = useAnimatedSidebarPosition();

  return (
    <HelperPanelPortal>
      <Fade
        in={Boolean(currentDataset && isDesktop && style)}
        timeout={{
          appear: 300,
          enter: 300,
          exit: 0,
        }}
      >
        <AnimatedStack
          direction="column"
          maxWidth="12rem"
          padding={1}
          gap={1}
          bgcolor="secondaryContainer.main"
          boxShadow={2}
          style={style!}
          position="sticky"
        >
          <HelperPanelHeader />
          <Divider />
          <HelperPanelStatus />
          <HelperPanelBody />
          <HelperPanelActions />
        </AnimatedStack>
      </Fade>
    </HelperPanelPortal>
  );
}
