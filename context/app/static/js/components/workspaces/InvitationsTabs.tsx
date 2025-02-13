import React from 'react';
import Box from '@mui/material/Box';

import InvitationsTable from 'js/components/workspaces/InvitationsTable';
import { Tabs, Tab } from 'js/shared-styles/tables/TableTabs';
import { useTabs, TabPanel } from 'js/shared-styles/tabs';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
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

function InvitationTabs({
  sentInvitations,
  receivedInvitations,
  isLoading,
}: {
  sentInvitations: WorkspaceInvitation[];
  receivedInvitations?: WorkspaceInvitation[];
  isLoading: boolean;
}) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant="fullWidth">
        {receivedInvitations && <InvitationTab label="Received" index={1} key={1} icon={ReceivedIcon} />}
        <InvitationTab label="Sent" index={0} key={0} icon={SentIcon} />
      </Tabs>
      <TabPanel value={openTabIndex} index={1} key={1}>
        {receivedInvitations && (
          <InvitationsTable status="Received" invitations={receivedInvitations} isLoading={isLoading} />
        )}
      </TabPanel>
      <TabPanel value={openTabIndex} index={0} key={0}>
        <InvitationsTable status="Sent" invitations={sentInvitations} isLoading={isLoading} />
      </TabPanel>
    </Box>
  );
}

export default InvitationTabs;
