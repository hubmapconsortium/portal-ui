import React, { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatDate } from 'date-fns/format';
import Divider from '@mui/material/Divider';
import { useIsDesktop } from 'js/hooks/media-queries';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import { CloudDownloadRounded } from '@mui/icons-material';
import { useAppContext } from 'js/components/Contexts';
import { formatSectionHash } from 'js/shared-styles/sections/TableOfContents/utils';
import { useAnimatedSidebarPosition } from 'js/shared-styles/sections/TableOfContents/hooks';
import { animated } from '@react-spring/web';
import { HelperPanelPortal } from '../../DetailLayout/DetailLayout';
import useProcessedDataStore from '../store';
import StatusIcon from '../../StatusIcon';
import { getDateLabelAndValue } from '../../utils';
import { HelperPanelButton } from './styles';

function useCurrentDataset() {
  return useProcessedDataStore((state) => state.currentDataset);
}

function HelperPanelHeader() {
  const currentDataset = useCurrentDataset();
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" gap={0.5} whiteSpace="nowrap">
      <SchemaRounded fontSize="small" />
      <a href={`#${formatSectionHash(`section-${currentDataset?.hubmap_id}`)}`}>{currentDataset?.hubmap_id}</a>
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
      <Typography variant="body2">{currentDataset.status}</Typography>
    </Stack>
  );
}

interface HelperPanelBodyItemProps extends PropsWithChildren {
  label: string;
  noWrap?: boolean;
}

const noWrapStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
};

function HelperPanelBodyItem({ label, children, noWrap }: HelperPanelBodyItemProps) {
  const valueStyles = noWrap ? noWrapStyles : {};
  return (
    <Stack direction="column">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body2" sx={valueStyles}>
        {children}
      </Typography>
    </Stack>
  );
}

function HelperPanelBody() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  const [dateLabel, date] = getDateLabelAndValue(currentDataset);
  return (
    <>
      {currentDataset.title && <HelperPanelBodyItem label="Title">{currentDataset.title}</HelperPanelBodyItem>}
      {currentDataset.description && (
        <HelperPanelBodyItem label="Description" noWrap>
          {currentDataset.description}
        </HelperPanelBodyItem>
      )}
      <HelperPanelBodyItem label="Pipeline">{currentDataset.pipeline}</HelperPanelBodyItem>
      <HelperPanelBodyItem label="Consortium">{currentDataset.group_name}</HelperPanelBodyItem>
      <HelperPanelBodyItem label={dateLabel}>{date && formatDate(date, 'yyyy-MM-dd')}</HelperPanelBodyItem>
    </>
  );
}

function HelperPanelActions() {
  const currentDataset = useCurrentDataset();
  // TODO: Add workspace actions/dropdown menu
  const { isWorkspacesUser } = useAppContext();
  return (
    <>
      {isWorkspacesUser && <HelperPanelButton startIcon={<WorkspacesIcon />}>Workspace</HelperPanelButton>}
      <HelperPanelButton
        startIcon={<CloudDownloadRounded />}
        href={`#bulk-data-transfer?bulk-data=${currentDataset?.hubmap_id}`}
      >
        Bulk Download
      </HelperPanelButton>
    </>
  );
}

const AnimatedStack = animated(Stack);

export default function HelperPanel() {
  const currentDataset = useCurrentDataset();
  // const panelOffset = useProcessedDataStore((state) => state.currentDatasetOffset);
  const isDesktop = useIsDesktop();
  const style = useAnimatedSidebarPosition();
  if (!currentDataset || !isDesktop) {
    return null;
  }
  return (
    <HelperPanelPortal>
      <AnimatedStack
        direction="column"
        maxWidth="12rem"
        padding={1}
        gap={1}
        bgcolor="secondaryContainer.main"
        boxShadow={2}
        style={style}
        position="sticky"
      >
        <HelperPanelHeader />
        <Divider />
        <HelperPanelStatus />
        <HelperPanelBody />
        <HelperPanelActions />
      </AnimatedStack>
    </HelperPanelPortal>
  );
}
