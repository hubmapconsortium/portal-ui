import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import Stack from '@mui/material/Stack';

import { leftRouteBoundaryID, rightRouteBoundaryID } from 'js/components/Routes/Route/Route';
import { SavedListsSuccessAlert } from 'js/components/savedLists/SavedListsAlerts';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { TableOfContentsItems } from 'js/shared-styles/sections/TableOfContents/types';
import { SectionOrder, getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import { EventInfo } from 'js/components/types';

type DetailLayoutProps = {
  trackingInfo?: EventInfo;
  isLoading?: boolean;
  tableOfContentsTitle?: string;
  tableOfContentsTitleHref?: string;
} & PropsWithChildren &
  (
    | {
        sections: SectionOrder;
        customTableOfContents?: never;
        customCurrentSection?: never;
      }
    | {
        sections?: never;
        customTableOfContents: TableOfContentsItems;
        customCurrentSection: string;
      }
  );

export function TableOfContentsPortal({
  items,
  isLoading = false,
  trackingInfo,
  initialCurrentSection,
  tableOfContentsTitle,
  tableOfContentsTitleHref,
}: {
  items: TableOfContentsItems;
  isLoading: boolean;
  trackingInfo?: EventInfo;
  initialCurrentSection?: string;
  tableOfContentsTitle?: string;
  tableOfContentsTitleHref?: string;
}) {
  const element = document.getElementById(leftRouteBoundaryID);

  if (!element) {
    return null;
  }
  return createPortal(
    <Stack alignItems="end" alignSelf="flex-start">
      <TableOfContents
        items={items}
        isLoading={isLoading}
        trackingInfo={trackingInfo}
        initialCurrentSection={initialCurrentSection}
        title={tableOfContentsTitle}
        titleHref={tableOfContentsTitleHref}
      />
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
    <Stack
      alignItems="start"
      position="relative"
      sx={{
        pointerEvents: 'none',
        zIndex: 1000,
        '& > *': {
          pointerEvents: 'auto',
        },
      }}
    >
      {children}
    </Stack>,
    element,
  );
}

function DetailLayout({
  sections,
  children,
  isLoading = false,
  trackingInfo,
  customTableOfContents,
  customCurrentSection,
  tableOfContentsTitle,
  tableOfContentsTitleHref,
}: DetailLayoutProps) {
  const items = customTableOfContents || getSections(sections);

  return (
    <>
      <SavedListsSuccessAlert />
      <TableOfContentsPortal
        items={items}
        isLoading={isLoading}
        trackingInfo={trackingInfo}
        initialCurrentSection={customCurrentSection}
        tableOfContentsTitle={tableOfContentsTitle}
        tableOfContentsTitleHref={tableOfContentsTitleHref}
      />
      <HelperPanelPortal />
      {children}
    </>
  );
}

export default DetailLayout;
