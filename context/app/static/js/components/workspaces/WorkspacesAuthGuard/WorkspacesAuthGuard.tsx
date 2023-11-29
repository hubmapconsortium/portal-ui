import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';

import { useAppContext } from 'js/components/Contexts';
import Description from 'js/shared-styles/sections/Description';
import { InternalLink } from 'js/shared-styles/Links';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

const StyledDescription = styled(Description)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

function WorkspacesAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isWorkspacesUser } = useAppContext();

  if (!isAuthenticated) {
    return (
      <StyledDescription>
        The workspaces feature is only available if you are logged in and part of the allowed Globus group.{' '}
        <InternalLink href="/login">Log in</InternalLink> to view saved workspaces or to begin a new workspace.
      </StyledDescription>
    );
  }

  if (!isWorkspacesUser) {
    return (
      <StyledDescription>
        You must be a member of the allowed Globus group to access this feature.{' '}
        <ContactUsLink variant="body2">Contact us</ContactUsLink> to gain access.
      </StyledDescription>
    );
  }

  return children;
}

export default WorkspacesAuthGuard;
