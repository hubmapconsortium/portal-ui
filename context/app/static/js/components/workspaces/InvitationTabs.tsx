import React from 'react';
import Box from '@mui/material/Box';
import { useEventCallback } from '@mui/material/utils';

import InvitationsTable from 'js/components/workspaces/Tables/InvitationsTable';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
import { Tabs, Tab } from 'js/shared-styles/tables/TableTabs';
import { useTabs, TabPanel } from 'js/shared-styles/tabs';
import { ReceivedIcon, SentIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';

interface InvitationTabProps {
  label: string;
  index: number;
  icon: React.ElementType;
}
function InvitationTab({ label, index, icon: Icon, ...props }: InvitationTabProps) {
  return (
    <Tab icon={<Icon fontSize="1.5rem" />} label={label} key={index} index={index} iconPosition="start" {...props} />
  );
}

interface InvitationTabsProps {
  sentInvitations: WorkspaceInvitation[];
  receivedInvitations?: WorkspaceInvitation[];
  isLoading?: boolean;
}
function InvitationTabs({ sentInvitations, receivedInvitations, isLoading }: InvitationTabsProps) {
  const { openTabIndex, handleTabChange } = useTabs();
  const [receivedIdx, sentIdx] = receivedInvitations ? [0, 1] : [1, 0];

  const { currentEventCategory } = useWorkspacesEventContext();

  const handleChange = useEventCallback((_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    trackEvent({
      category: currentEventCategory,
      action: 'Workspace Invitations / Received / Switch Tabs',
      label: newValue === receivedIdx ? 'Received' : 'Sent',
    });
    handleTabChange(_event, newValue);
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleChange} variant="fullWidth">
        {receivedInvitations && (
          <InvitationTab label="Received" index={receivedIdx} key={receivedIdx} icon={ReceivedIcon} />
        )}
        <InvitationTab label="Sent" index={sentIdx} key={sentIdx} icon={SentIcon} />
      </Tabs>
      <TabPanel value={openTabIndex} index={receivedIdx} key={receivedIdx}>
        {receivedInvitations && (
          <InvitationsTable status="Received" invitations={receivedInvitations} isLoading={isLoading} />
        )}
      </TabPanel>
      <TabPanel value={openTabIndex} index={sentIdx} key={sentIdx}>
        <InvitationsTable status="Sent" invitations={sentInvitations} isLoading={isLoading} />
      </TabPanel>
    </Box>
  );
}

export default InvitationTabs;
