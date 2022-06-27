import React, { useContext } from 'react';

import { AppContext } from 'js/components/Providers';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';
import { LightBlueLink } from 'js/shared-styles/Links';
import WorkspacesList from 'js/components/workspaces/WorkspacesList';

function Workspaces() {
  const { isAuthenticated } = useContext(AppContext);
  return (
    <>
      <SectionHeader variant="h1" component="h1">
        My Workspaces
      </SectionHeader>
      {!isAuthenticated ? (
        <Description padding="20px">
          The workspaces feature is only available if logged in. <LightBlueLink href="/login">Log in</LightBlueLink> to
          view saved workspaces or to begin a new workspace.
        </Description>
      ) : (
        <>
          <Description padding="20px">
            {/*
              TODO: Add links below.
              TODO: Not all of these entry points will be functional on first release. Update text accordingly.
            */}
            Workspaces are provided through Jupyter notebooks. Navigate to a dataset, collection, dataset search or the
            My Lists page to begin a new workspace.
          </Description>
          <WorkspacesList />
        </>
      )}
    </>
  );
}

export default Workspaces;
