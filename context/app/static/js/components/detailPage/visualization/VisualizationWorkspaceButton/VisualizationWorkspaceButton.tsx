import React from 'react';

import SvgIcon from '@mui/icons-material/Download';

import { WorkspacesIcon } from 'js/shared-styles/icons';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { useAppContext } from 'js/components/Contexts';

const tooltip = 'Launch New Workspace';

interface VisualizationWorkspaceButtonProps {
  uuid?: string;
  hubmap_id?: string;
  mapped_data_access_level?: string;
  hasNotebook?: boolean;
}

function VisualizationWorkspaceButton({
  uuid = '',
  hubmap_id,
  mapped_data_access_level,
  hasNotebook,
}: VisualizationWorkspaceButtonProps) {
  const { isWorkspacesUser } = useAppContext();
  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    defaultTemplate: 'visualization',
    initialSelectedDatasets: [uuid],
  });

  if (!isWorkspacesUser ?? mapped_data_access_level === 'Protected' ?? !uuid ?? !hubmap_id ?? !hasNotebook) {
    return null;
  }

  return (
    <>
      <NewWorkspaceDialog {...rest} />
      <SecondaryBackgroundTooltip title={tooltip}>
        <WhiteBackgroundIconButton onClick={() => setDialogIsOpen(true)}>
          <SvgIcon color="primary" component={WorkspacesIcon} />
        </WhiteBackgroundIconButton>
      </SecondaryBackgroundTooltip>
    </>
  );
}

export default VisualizationWorkspaceButton;
