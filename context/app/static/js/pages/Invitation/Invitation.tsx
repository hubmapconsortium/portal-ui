import React from 'react';
import Stack from '@mui/material/Stack';

import { useInvitationDetail } from 'js/components/workspaces/hooks';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import { WorkspaceInvitation } from 'js/components/workspaces/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { DetailPageSection } from 'js/components/detailPage/DetailPageSection';

function Summary({ invitation }: { invitation: WorkspaceInvitation }) {
  return (
    <DetailPageSection id="summary">
      <Stack spacing={1}>{invitation.shared_workspace_id.name}</Stack>
    </DetailPageSection>
  );
}

interface InvitationPageProps {
  invitationId: number;
}

function InvitationPage({ invitationId }: InvitationPageProps) {
  const { invitation, invitationsLoading } = useInvitationDetail({
    invitationId,
  });

  if (invitationsLoading || !invitation) {
    return null;
  }

  const shouldDisplaySection = {
    summary: true,
    datasets: true,
    templates: true,
  };

  return (
    <WorkspacesAuthGuard>
      {/* <WorkspacesListDialogs selectedWorkspaceIds={new Set([workspaceId.toString()])} /> */}
      <DetailLayout sections={shouldDisplaySection}>
        <Stack gap={1} sx={{ marginBottom: 5 }}>
          <Summary invitation={invitation} />
          {/* <SentInvitationsStatus sentInvitations={workspaceSentInvitations} />
          <Datasets workspace={workspace} workspaceDatasets={workspaceDatasets} />
          <Templates workspace={workspace} workspaceTemplates={workspaceTemplates} /> */}
        </Stack>
      </DetailLayout>
    </WorkspacesAuthGuard>
  );
}

export default InvitationPage;
