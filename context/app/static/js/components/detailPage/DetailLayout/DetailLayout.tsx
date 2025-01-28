import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import Stack from '@mui/material/Stack';

import { leftRouteBoundaryID, rightRouteBoundaryID } from 'js/components/Routes/Route/Route';
import { SavedListsSuccessAlert } from 'js/components/savedLists/SavedListsAlerts';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { TableOfContentsItems } from 'js/shared-styles/sections/TableOfContents/types';
import { SectionOrder, getSections } from 'js/shared-styles/sections/TableOfContents/utils';

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
  return createPortal(
    <Stack alignItems="start" alignSelf="flex-start" height="100%">
      {children}
    </Stack>,
    element,
  );
}

function DetailLayout({ sections, children, isLoading = false }: DetailLayoutProps) {
  const items = getSections(sections);

  return (
    <>
      <SavedListsSuccessAlert />
      <TableOfContentsPortal items={items} isLoading={isLoading} />
      {children}
    </>
  );
}

export default DetailLayout;
