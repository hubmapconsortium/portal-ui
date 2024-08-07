import React, { useMemo } from 'react';

import Download from '@mui/icons-material/Download';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';

const tooltip = 'Launch new workspace or download a Jupyter notebook for this visualization.';

interface VisualizationNotebookButtonProps {
  uuid: string;
  hubmap_id: string;
  mapped_data_access_level: string;
}

function VisualizationNotebookButton({ uuid, hubmap_id, mapped_data_access_level }: VisualizationNotebookButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    defaultTemplate: 'visualization',
  });

  const downloadNotebook = useMemo(() => {
    return () => {
      trackEntityPageEvent({ action: `Vitessce / ${tooltip}` });
      postAndDownloadFile({
        url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
        body: {},
      })
        .then(() => {
          // Do nothing
        })
        .catch(() => {
          toastError('Failed to download Jupyter Notebook');
        });
    };
  }, [uuid, toastError, trackEntityPageEvent]);

  const menuOptions = [
    {
      children: 'Launch New Workspace',
      onClick: () => setDialogIsOpen(true),
      disabled: mapped_data_access_level === 'Protected',
      icon: WorkspacesIcon,
    },
    {
      children: 'Download Jupyter Notebook',
      onClick: downloadNotebook,
      icon: Download,
    },
  ];

  return (
    <>
      <NewWorkspaceDialog datasetUUIDs={new Set([uuid])} {...rest} />
      <IconDropdownMenu tooltip={tooltip} icon={WorkspacesIcon} options={menuOptions} />
    </>
  );
}

export default withDropdownMenuProvider(VisualizationNotebookButton, false);
