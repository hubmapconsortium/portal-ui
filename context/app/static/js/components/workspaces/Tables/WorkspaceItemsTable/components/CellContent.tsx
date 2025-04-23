import React from 'react';
import { useCellContent } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { WorkspaceItem } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import Stack from '@mui/material/Stack';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import LineClamp from 'js/shared-styles/text/LineClamp';
import Box from '@mui/material/Box';
import { getFieldValue, getItemId } from 'js/components/workspaces/utils';
import InvitationStatusIcon from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/InvitationStatusIcon';
import NonLinkingCreatorInfo from 'js/shared-styles/Links/NonLinkingCreatorInfo';
import Typography from '@mui/material/Typography';
import { TooltipButton } from 'js/shared-styles/buttons/TooltipButton';
import { EmailIcon } from 'js/shared-styles/icons';
import { format } from 'date-fns/format';
import { workspaceStatusIconMap } from 'js/shared-styles/icons/workspaceStatusIconMap';
import SvgIcon from '@mui/material/SvgIcon';

function CellContent({ item, field }: { field: string; item: WorkspaceItem }) {
  const { prefix, fieldValue, itemId, hasWorkspacePage, trackNameClick, handleEmailClick } = useCellContent(
    item,
    field,
  );

  switch (field) {
    case `${prefix}name`: {
      const href = hasWorkspacePage ? `/workspaces/${itemId}` : `/invitations/${itemId}`;

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <InternalLink href={href} onClick={trackNameClick}>
            <LineClamp lines={1}>{fieldValue}</LineClamp>
          </InternalLink>
          {/* We retrieve the ID this way here because we want to show the shared IDs (which will be distinct)
           for sent workspace invites, which can be shared multiple times. */}
          <Box>{`(ID: ${getItemId(item)})`}</Box>
          <InvitationStatusIcon item={item} />
        </Stack>
      );
    }
    case `${prefix}user_id.username`:
    case `${prefix}creatorInfo`: {
      if (!fieldValue || fieldValue === 'Me' || fieldValue === 'Unknown') {
        return <NonLinkingCreatorInfo creatorInfo={fieldValue} />;
      }

      const baseField = field === `${prefix}creatorInfo` ? 'creatorInfo' : 'user_id';
      const firstName = getFieldValue({ item, field: `${baseField}.first_name`, prefix });
      const lastName = getFieldValue({ item, field: `${baseField}.last_name`, prefix });
      const email = getFieldValue({ item, field: `${baseField}.email`, prefix });

      return (
        <Stack direction="row" alignItems="center">
          <Typography>{`${firstName} ${lastName}`}</Typography>
          <TooltipButton sx={{ minWidth: 0 }} tooltip={`Mail to ${email}`} onClick={() => handleEmailClick(email)}>
            <EmailIcon color="info" />
          </TooltipButton>
        </Stack>
      );
    }
    case `${prefix}datetime_created`:
    case `${prefix}datetime_share_created`:
    case `${prefix}datetime_last_job_launch`: {
      const date = fieldValue ?? getFieldValue({ item, field: 'datetime_created', prefix });
      return format(date, 'yyyy-MM-dd');
    }
    case 'status': {
      const { icon, color } = workspaceStatusIconMap[fieldValue];
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>{fieldValue}</Typography>
          <SvgIcon fontSize=".9rem" component={icon} color={color} />
        </Stack>
      );
    }
    default:
      return <Typography>{fieldValue}</Typography>;
  }
}

export default CellContent;
