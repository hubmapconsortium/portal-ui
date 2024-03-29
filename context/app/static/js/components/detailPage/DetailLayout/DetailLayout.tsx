import React, { PropsWithChildren } from 'react';

import useEntityStore, { savedAlertStatus, editedAlertStatus, EntityStore } from 'js/stores/useEntityStore';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import { Content, FlexRow, StyledAlert } from './style';

const entityStoreSelector = (state: EntityStore) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

interface DetailLayoutProps extends PropsWithChildren {
  sectionOrder: string[];
}

function DetailAlert() {
  const { shouldDisplaySavedOrEditedAlert, setShouldDisplaySavedOrEditedAlert } = useEntityStore(entityStoreSelector);

  if (shouldDisplaySavedOrEditedAlert === savedAlertStatus) {
    return (
      <StyledAlert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)}>
        Successfully added to My Saves List. All lists are currently stored on local storage and are not transferable
        between devices.
      </StyledAlert>
    );
  }

  if (shouldDisplaySavedOrEditedAlert === editedAlertStatus) {
    return (
      <StyledAlert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)}>
        Successfully updated save status. All lists are currently stored on local storage and are not transferable
        between devices.
      </StyledAlert>
    );
  }
}

function DetailLayout({ sectionOrder, children }: DetailLayoutProps) {
  // section hash must match section id in each component
  const sections = new Map(getSections(sectionOrder));

  return (
    <>
      <DetailAlert />
      <FlexRow>
        <TableOfContents items={[...sections.values()]} />
        <Content>{children}</Content>
      </FlexRow>
    </>
  );
}

export default DetailLayout;
