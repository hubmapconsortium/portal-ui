import { WorkspaceInvitation } from 'js/components/workspaces/types';
import { get } from 'js/helpers/nodash';

function getInvitationFieldValue(invitation: WorkspaceInvitation, identifier: string) {
  return get(invitation, identifier, '');
}

export { getInvitationFieldValue };
