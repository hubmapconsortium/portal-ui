import React from 'react';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { LinkContainer, StyledLink } from './style';

import { DBGAP_TEXT, SRA_EXPERIMENT_TEXT } from './const';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

interface BulkDataTransferLinkProps {
  href: string;
  title?: string;
  description?: string;
  tooltip?: string;
  documentationLink?: string;
}

function Link({ href, title, description, tooltip, documentationLink }: BulkDataTransferLinkProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const onClick = () => trackEntityPageEvent({ action: 'Bulk Data Transfer / Panel Link', label: title });
  return (
    <>
      <Divider />
      <LinkContainer>
        <StyledLink variant="subtitle2">
          {title && (
            <OutboundIconLink onClick={onClick} href={href}>
              {title}
            </OutboundIconLink>
          )}
          {tooltip && (
            <SecondaryBackgroundTooltip title={tooltip}>
              <InfoIcon />
            </SecondaryBackgroundTooltip>
          )}
        </StyledLink>
        {description && <Typography variant="body2">{description}</Typography>}
        {documentationLink && (
          <>
            &nbsp;Here is&nbsp;
            <OutboundIconLink href={documentationLink}>additional documentation</OutboundIconLink>.
          </>
        )}
      </LinkContainer>
    </>
  );
}

export function DbGaPLink({ href }: Pick<BulkDataTransferLinkProps, 'href'>) {
  return <Link href={href} {...DBGAP_TEXT} />;
}

export function SRAExperimentLink({ href }: Pick<BulkDataTransferLinkProps, 'href'>) {
  return <Link {...SRA_EXPERIMENT_TEXT} href={href} />;
}

export default Link;
