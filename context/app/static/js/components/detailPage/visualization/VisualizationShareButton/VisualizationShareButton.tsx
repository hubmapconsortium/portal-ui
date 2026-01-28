import React from 'react';

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import Download from '@mui/icons-material/Download';

import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { WhiteBackgroundIconDropdownMenuButton } from 'js/shared-styles/buttons';
import { EventWithOptionalCategory } from 'js/components/types';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { postAndDownloadFile } from 'js/helpers/download';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { createEmailWithUrl, getUrl } from './utils';
import { DEFAULT_LONG_URL_WARNING } from './constants';
import { FileIcon } from 'js/shared-styles/icons';
import { useEventCallback } from '@mui/material/utils';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  vitessceState: state.vitessceState,
});

interface VisualizationShareButtonProps {
  trackingInfo: EventWithOptionalCategory;
  uuid?: string;
  hasNotebook?: boolean;
  parentUuid?: string;
}

function VisualizationShareButton({ trackingInfo, uuid, hasNotebook, parentUuid }: VisualizationShareButtonProps) {
  const { vitessceState } = useVisualizationStore(visualizationStoreSelector);
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const handleCopyClick = useHandleCopyClick();
  const { toastError } = useSnackbarActions();

  const copyLink = useEventCallback(() => {
    trackEntityPageEvent({ ...trackingInfo, action: `${trackingInfo.action} / Share Visualization` });

    let urlIsLong = false;
    const url = getUrl(vitessceState as object, () => {
      urlIsLong = true;
    });

    const message = urlIsLong ? DEFAULT_LONG_URL_WARNING : '';
    handleCopyClick(url, message);
  });

  const copyConf = useEventCallback(() => {
    trackEntityPageEvent({
      ...trackingInfo,
      action: `${trackingInfo.action} / Copy Visualization Configuration to Clipboard`,
    });
    const configString = JSON.stringify(vitessceState, null, 2);
    handleCopyClick(configString);
  });

  const downloadConf = useEventCallback(() => {
    trackEntityPageEvent({
      ...trackingInfo,
      action: `${trackingInfo.action} / Download Visualization Configuration`,
    });
    const configString = JSON.stringify(vitessceState, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vitessce_config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  const emailConf = useEventCallback(() => {
    trackEntityPageEvent({ ...trackingInfo, action: `${trackingInfo.action} / Share Visualization` });
    createEmailWithUrl(vitessceState as object);
  });

  const downloadNotebook = useEventCallback(() => {
    trackEntityPageEvent({ action: `Vitessce / Download Jupyter Notebook` });
    postAndDownloadFile({
      url: `/notebooks/entities/dataset/${parentUuid ?? uuid}.ws.ipynb`,
      body: {},
    })
      .then()
      .catch(() => {
        toastError('Failed to download Jupyter Notebook');
      });
  });

  const options = [
    {
      children: 'Copy Visualization Link',
      onClick: copyLink,
      icon: LinkIcon,
    },
    {
      children: 'Copy Visualization Configuration',
      onClick: copyConf,
      icon: ContentCopyIcon,
    },
    {
      children: 'Download Visualization Configuration',
      onClick: downloadConf,
      icon: FileIcon,
    },
    ...(uuid && hasNotebook
      ? [
          {
            children: 'Download Jupyter Notebook',
            onClick: downloadNotebook,
            icon: Download,
          },
        ]
      : []),
    {
      children: 'Email',
      onClick: emailConf,
      icon: EmailIcon,
    },
  ];

  return (
    <IconDropdownMenu tooltip="Share Visualization" icon={ShareIcon} button={WhiteBackgroundIconDropdownMenuButton}>
      {options.map((props) => (
        <IconDropdownMenuItem key={props.children} {...props} />
      ))}
    </IconDropdownMenu>
  );
}

export default withShouldDisplay(VisualizationShareButton);
