import React from 'react';

import SvgIcon from '@mui/icons-material/Download';

import { WorkspacesIcon } from 'js/shared-styles/icons';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { useAppContext } from 'js/components/Contexts';
import { useDetailContext } from 'js/components/detailPage/DetailContext';
import { useProcessedDatasetDetails } from 'js/components/detailPage/ProcessedData/ProcessedDataset/hooks';

const tooltip = 'Launch New Workspace';

interface VisualizationWorkspaceButtonProps {
  uuid?: string;
}

function VisualizationWorkspaceButton({ uuid = '' }: VisualizationWorkspaceButtonProps) {
  const { mapped_data_access_level } = useDetailContext();
  const {
    datasetDetails: { hubmap_id },
  } = useProcessedDatasetDetails(uuid);
  const { isWorkspacesUser } = useAppContext();

  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    defaultTemplate: 'visualization',
    initialSelectedDatasets: [uuid],
  });

  if (!isWorkspacesUser || !hubmap_id || mapped_data_access_level !== 'Public') {
    return null;
  }

  return (
    <>
      <NewWorkspaceDialog {...rest} />
      <WhiteBackgroundIconTooltipButton tooltip={tooltip} onClick={() => setDialogIsOpen(true)}>
        <SvgIcon color="primary" component={WorkspacesIcon} />
      </WhiteBackgroundIconTooltipButton>
    </>
  );
}

export default VisualizationWorkspaceButton;
