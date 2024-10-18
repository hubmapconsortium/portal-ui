import React from 'react';

import SvgIcon from '@mui/icons-material/Download';

import { WorkspacesIcon } from 'js/shared-styles/icons';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { useAppContext } from 'js/components/Contexts';
import { useCurrentDataset } from 'js/components/detailPage/utils';

const tooltip = 'Launch New Workspace';

function VisualizationWorkspaceButton() {
  const currentDataset = useCurrentDataset();
  const { isWorkspacesUser } = useAppContext();

  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: currentDataset?.hubmap_id,
    defaultTemplate: 'visualization',
    initialSelectedDatasets: currentDataset ? [currentDataset.uuid] : [],
  });

  if (!isWorkspacesUser || !currentDataset?.hubmap_id || currentDataset?.mapped_data_access_level !== 'Public') {
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
