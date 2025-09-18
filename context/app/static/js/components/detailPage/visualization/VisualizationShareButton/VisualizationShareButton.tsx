import React from 'react';

import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';

import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { WhiteBackgroundIconDropdownMenuButton } from 'js/shared-styles/buttons';
import { EventWithOptionalCategory } from 'js/components/types';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { createEmailWithUrl, getUrl } from './utils';
import { DEFAULT_LONG_URL_WARNING } from './constants';

const visualizationStoreSelector = (state: VisualizationStore) => ({
  vitessceState: state.vitessceState,
});

function VisualizationShareButton({ trackingInfo }: { trackingInfo: EventWithOptionalCategory }) {
  const { vitessceState } = useVisualizationStore(visualizationStoreSelector);
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const handleCopyClick = useHandleCopyClick();

  const copyLink = () => {
    trackEntityPageEvent({ ...trackingInfo, action: `${trackingInfo.action} / Share Visualization` });

    let urlIsLong = false;
    const url = getUrl(vitessceState as object, () => {
      urlIsLong = true;
    });

    const message = urlIsLong ? DEFAULT_LONG_URL_WARNING : '';
    handleCopyClick(url, message);
  };

  const options = [
    {
      children: 'Copy Visualization Link',
      onClick: copyLink,
      icon: LinkIcon,
    },
    {
      children: 'Email',
      onClick: () => {
        trackEntityPageEvent({ ...trackingInfo, action: `${trackingInfo.action} / Share Visualization` });
        createEmailWithUrl(vitessceState as object);
      },
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
