import React from 'react';
import Box from '@mui/material/Box';

import InvitationsTable from 'js/components/workspaces/Tables/InvitationsTable';
import { WorkspaceInvitation, WorkspacesEventCategories } from 'js/components/workspaces/types';
import { Tabs, Tab } from 'js/shared-styles/tables/TableTabs';
import { useTabs, TabPanel } from 'js/shared-styles/tabs';
import { ReceivedIcon, SentIcon } from 'js/shared-styles/icons';
import { useEventCallback } from '@mui/material';
import { trackEvent } from 'js/helpers/trackers';

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
  eventCategory: WorkspacesEventCategories;
  detailPageName?: string;
}
function InvitationTabs({
  sentInvitations,
  receivedInvitations,
  isLoading,
  eventCategory,
  detailPageName,
}: InvitationTabsProps) {
  const { openTabIndex, handleTabChange } = useTabs();
  const [receivedIdx, sentIdx] = receivedInvitations ? [0, 1] : [1, 0];

  const handleChange = useEventCallback((_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    handleTabChange(_event, newValue);
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceLandingPage,
      action: 'Workspace Invitations / Received / Switch Tabs',
      label: newValue === receivedIdx ? 'Received' : 'Sent',
    });
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
          <InvitationsTable
            status="Received"
            invitations={receivedInvitations}
            isLoading={isLoading}
            eventCategory={eventCategory}
            detailPageName={detailPageName}
          />
        )}
      </TabPanel>
      <TabPanel value={openTabIndex} index={sentIdx} key={sentIdx}>
        <InvitationsTable
          status="Sent"
          invitations={sentInvitations}
          isLoading={isLoading}
          eventCategory={eventCategory}
          detailPageName={detailPageName}
        />
      </TabPanel>
    </Box>
  );
}

export default InvitationTabs;
