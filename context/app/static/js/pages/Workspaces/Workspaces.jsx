import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import { LightBlueLink } from 'js/shared-styles/Links';

function Services() {
  const endpoints = useContext(AppContext);
  // eslint-disable-next-line no-console
  console.log(`TODO: Use ${endpoints.workspacesEndpoint}`);
  return (
    <>
      <SectionHeader variant="h1" component="h1">
        My Workspaces
      </SectionHeader>
      <Description padding="20px">
        The workspaces feature is only available if logged in. <LightBlueLink href="/login">Log in</LightBlueLink> to
        view saved workspaces or to begin a new workspace.
      </Description>
    </>
  );
}

export default Services;
