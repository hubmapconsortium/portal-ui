import React from 'react';
import Box from '@mui/material/Box';

import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { useTabs } from 'js/shared-styles/tabs';
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
  recievedInvitations,
}: {
  sentInvitations: WorkspaceInvitation[];
  recievedInvitations?: WorkspaceInvitation[];
}) {
  const { openTabIndex, handleTabChange } = useTabs();

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={openTabIndex} onChange={handleTabChange} variant="fullWidth">
        {recievedInvitations && <InvitationTab label="Received" index={0} key={0} icon={ReceivedIcon} />}
        {sentInvitations && <InvitationTab label="Sent" index={1} key={1} icon={SentIcon} />}
      </Tabs>
      <TabPanel value={openTabIndex} index={0} key={0}>
        inner stuff
      </TabPanel>
      <TabPanel value={openTabIndex} index={1} key={1}>
        inner stuff
      </TabPanel>
    </Box>
  );
}

export default InvitationTabs;
