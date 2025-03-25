import React from 'react';
import { format } from 'date-fns/format';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useInvitationDetail } from 'js/components/workspaces/hooks';
import WorkspacesAuthGuard from 'js/components/workspaces/WorkspacesAuthGuard';
import { TemplatesTypes, WorkspaceInvitation, WorkspacesEventCategories } from 'js/components/workspaces/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { CollapsibleDetailPageSection, DetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import NameAndEmailLink from 'js/shared-styles/Links/NameAndEmailLink';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import WorkspaceDatasetsTable from 'js/components/workspaces/WorkspaceDatasetsTable';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import TemplateGrid from 'js/components/workspaces/TemplateGrid';
import WorkspacesListDialogs from 'js/components/workspaces/WorkspacesListDialogs';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';

import { StyledAlert } from './style';

const descriptions = {
  acceptInvite:
    'Accept this invitation to access a copy of the workspace at its current version. Any future changes to the workspace will not be synchronized.',
  datasetsAbsent: 'There are no datasets in this workspace.',
  datasetsPresent: 'These are the datasets included in this workspace.',
  templates: 'These are the templates that are in this workspace.',
};

const pages = [
  {
    link: '/workspaces',
    children: 'My Workspaces',
  },
];

const shouldDisplaySection = {
  summary: true,
  datasets: true,
  templates: true,
};

function Summary({ invitation }: { invitation: WorkspaceInvitation }) {
  const {
    shared_workspace_id: { name, description },
    original_workspace_id: {
      user_id: { first_name, last_name, email },
    },
    datetime_share_created,
  } = invitation;

  return (
    <DetailPageSection id="summary">
      <Stack spacing={1}>
        <SummaryData title={name} entity_type="Workspace" />
        <SectionPaper>
          <Stack spacing={2}>
            <LabelledSectionText label="Description">{description}</LabelledSectionText>
            <LabelledSectionText label="Shared By">
              <NameAndEmailLink first_name={first_name} last_name={last_name} email={email} />
            </LabelledSectionText>
            <LabelledSectionText label="Shared Date">
              {format(new Date(datetime_share_created), 'yyyy-MM-dd')}
            </LabelledSectionText>
            <RelevantPagesSection pages={pages} />
          </Stack>
        </SectionPaper>
      </Stack>
    </DetailPageSection>
  );
}

function Datasets({
  invitation,
  invitationDatasets,
}: {
  invitation: WorkspaceInvitation;
  invitationDatasets: string[];
}) {
  return (
    <CollapsibleDetailPageSection id="datasets" title="Datasets" icon={sectionIconMap.datasets}>
      <Stack spacing={1}>
        <SectionDescription>
          {invitationDatasets.length > 0 ? descriptions.datasetsPresent : descriptions.datasetsAbsent}
        </SectionDescription>
        <WorkspaceDatasetsTable
          datasetsUUIDs={invitationDatasets}
          isSelectable={false}
          trackingInfo={{
            category: WorkspacesEventCategories.WorkspaceDetailPage,
            label: invitation.shared_workspace_id.id.toString(),
          }}
          hideTableIfEmpty
          openLinksInNewTab
        />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

function Templates({ invitationTemplates }: { invitationTemplates: TemplatesTypes }) {
  return (
    <CollapsibleDetailPageSection id="templates" title="Templates" icon={sectionIconMap.templates}>
      <Stack>
        <SectionDescription>{descriptions.templates}</SectionDescription>
        <TemplateGrid
          templates={invitationTemplates}
          trackingInfo={{ category: WorkspacesEventCategories.WorkspacePreviewPage }}
          openLinksInNewTab
        />
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

interface InvitationPageProps {
  invitationId: number;
}
function InvitationPage({ invitationId }: InvitationPageProps) {
  const { invitation, invitationDatasets, invitationTemplates, invitationsLoading, handleAcceptInvitation } =
    useInvitationDetail({
      invitationId,
    });
  const { setDialogType, setInvitation } = useEditWorkspaceStore();
  const { toastSuccessAcceptInvitation, toastErrorAcceptInvitation } = useWorkspaceToasts();

  if (invitationsLoading || !invitation) {
    return null;
  }

  const handleAccept = () => {
    handleAcceptInvitation(invitationId)
      .then(() => {
        toastSuccessAcceptInvitation(invitation.shared_workspace_id.name);
        // Redirect to the newly created workspace page
        window.location.href = `/workspaces/${invitationId}`;
      })
      .catch((e) => {
        console.error(e);
        toastErrorAcceptInvitation(invitation.shared_workspace_id.name);
      });
  };

  const handleDecline = () => {
    setInvitation(invitation);
    setDialogType('DECLINE_INVITATION');
  };

  return (
    <WorkspacesAuthGuard>
      <WorkspacesListDialogs selectedWorkspaceIds={new Set([invitationId.toString()])} />
      <DetailLayout sections={shouldDisplaySection}>
        <StyledAlert
          severity="info"
          action={
            <Stack direction="row" gap={1}>
              <Button onClick={handleDecline}>Decline</Button>
              <Button onClick={handleAccept} color="success">
                Accept
              </Button>
            </Stack>
          }
        >
          {descriptions.acceptInvite}
        </StyledAlert>
        <Stack gap={1} sx={{ marginBottom: 5 }}>
          <Summary invitation={invitation} />
          <Datasets invitation={invitation} invitationDatasets={invitationDatasets} />
          <Templates invitationTemplates={invitationTemplates} />
        </Stack>
      </DetailLayout>
    </WorkspacesAuthGuard>
  );
}

export default InvitationPage;
