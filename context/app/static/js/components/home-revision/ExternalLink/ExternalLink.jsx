import React from 'react';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import Typography from '@material-ui/core/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { Flex } from './style';

function ExternalLink({ linkText, linkHref, description }) {
  return (
    <Flex>
      <div>
        <OutboundLink href={linkHref} variant="subtitle1">
          {linkText} <OpenInNewRoundedIcon size="small" />
        </OutboundLink>
        <Typography>{description}</Typography>
      </div>
    </Flex>
  );
}

export default ExternalLink;
