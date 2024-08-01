import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import Stack from '@mui/material/Stack';

import useEntityStore, { savedAlertStatus, editedAlertStatus, EntityStore } from 'js/stores/useEntityStore';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { TableOfContentsItems } from 'js/shared-styles/sections/TableOfContents/types';
import { leftRouteBoundaryID, rightRouteBoundaryID } from 'js/components/Routes/Route/Route';
import { SectionOrder, getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import { StyledAlert } from './style';

const entityStoreSelector = (state: EntityStore) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

interface DetailLayoutProps extends PropsWithChildren {
  sections: SectionOrder;
  isLoading?: boolean;
}

function TableOfContentsPortal({ items, isLoading = false }: { items: TableOfContentsItems; isLoading: boolean }) {
  const element = document.getElementById(leftRouteBoundaryID);

  if (!element) {
    return null;
  }
  return createPortal(
    <Stack alignItems="end" alignSelf="flex-start" height="100%">
      <TableOfContents items={items} isLoading={isLoading} />
    </Stack>,
    element,
  );
}

export function HelperPanelPortal({ children }: PropsWithChildren) {
  const element = document.getElementById(rightRouteBoundaryID);
  if (!element) {
    return null;
  }
  return createPortal(children, element);
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

function DetailLayout({ sections, children, isLoading = false }: DetailLayoutProps) {
  const items = getSections(sections);

  return (
    <>
      <DetailAlert />
      <TableOfContentsPortal items={items} isLoading={isLoading} />
      {children}
    </>
  );
}

export default DetailLayout;
