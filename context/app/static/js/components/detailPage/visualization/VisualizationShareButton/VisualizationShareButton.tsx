import React, { useReducer } from 'react';

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';

import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';

import { copyToClipBoard, createEmailWithUrl } from './utils';
import { DEFAULT_LONG_URL_WARNING } from './constants';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  vitessceState: state.vitessceState,
});

function VisualizationShareButton() {
  const [, toggle] = useReducer((v) => !v, false);
  const { vitessceState } = useVisualizationStore(visualizationStoreSelector);
  const { toastWarning, toastSuccess } = useSnackbarActions();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const copyLink = () => {
    let urlIsLong = false;
    trackEntityPageEvent({ action: 'Vitessce / Share Visualization' });
    copyToClipBoard(vitessceState as object, () => {
      urlIsLong = true;
    });
    const message = `Visualization URL copied to clipboard. ${urlIsLong ? DEFAULT_LONG_URL_WARNING : ''}`.trim();
    const toast = urlIsLong ? toastWarning : toastSuccess;

    toast(message);
    toggle();
  };

  const menuOptions = [
    {
      children: 'Copy Visualization Link',
      onClick: copyLink,
      icon: LinkIcon,
    },
    {
      children: 'Email',
      onClick: () => {
        createEmailWithUrl(vitessceState as object);
        toggle();
      },
      icon: EmailIcon,
    },
  ];

  return <IconDropdownMenu tooltip="Share Visualization" icon={ShareIcon} options={menuOptions} />;
}

export default VisualizationShareButton;
