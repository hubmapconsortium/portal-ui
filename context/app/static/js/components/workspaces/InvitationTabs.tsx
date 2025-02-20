import React from 'react';
import Box from '@mui/material/Box';

import InvitationsTable from 'js/components/workspaces/Tables/InvitationsTable';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
import { Tabs, Tab } from 'js/shared-styles/tables/TableTabs';
import { useTabs, TabPanel } from 'js/shared-styles/tabs';
import { ReceivedIcon, SentIcon } from 'js/shared-styles/icons';

interface InvitationTabProps {
  label: string;
  index: number;
  icon: React.ElementType;
}
function InvitationTab({ label, index, icon: Icon, ...props }: InvitationTabProps) {
  return (
    <Tab
      icon={<Icon fontSize="1.5rem" color="primary" />}
      label={label}
      key={index}
      index={index}
      iconPosition="start"
      {...props}
    />
  );
}

interface InvitationTabsProps {
  sentInvitations: WorkspaceInvitation[];
  receivedInvitations?: WorkspaceInvitation[];
  isLoading: boolean;
}
function InvitationTabs({ sentInvitations, receivedInvitations, isLoading }: InvitationTabsProps) {
  const { openTabIndex, handleTabChange } = useTabs();

  const ownTabIndex = 0;
  const sentTabIndex = 1;

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant="fullWidth">
        {receivedInvitations && (
          <InvitationTab label="Received" index={ownTabIndex} key={ownTabIndex} icon={ReceivedIcon} />
        )}
        <InvitationTab label="Sent" index={sentTabIndex} key={sentTabIndex} icon={SentIcon} />
      </Tabs>
      <TabPanel value={openTabIndex} index={ownTabIndex} key={ownTabIndex}>
        {receivedInvitations && (
          <InvitationsTable status="Received" invitations={receivedInvitations} isLoading={isLoading} />
        )}
      </TabPanel>
      <TabPanel value={openTabIndex} index={sentTabIndex} key={sentTabIndex}>
        <InvitationsTable status="Sent" invitations={sentInvitations} isLoading={isLoading} />
      </TabPanel>
    </Box>
  );
}

export default InvitationTabs;
