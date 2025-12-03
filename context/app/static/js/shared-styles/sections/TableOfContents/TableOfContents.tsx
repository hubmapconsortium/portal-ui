import React, { useCallback, useState, useRef, useEffect } from 'react';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';

import { animated } from '@react-spring/web';

import { TableTitle, StyledItemLink, StyledIconContainer } from './style';
import { TableOfContentsItem, TableOfContentsItems, TableOfContentsItemWithNode } from './types';
import { getItemsClient } from './utils';
import { useThrottledOnScroll, useFindActiveIndex, useAnimatedSidebarPosition } from './hooks';
import { useEventCallback } from '@mui/material/utils';

const AnimatedNav = animated('nav');

interface LinkProps {
  currentSection: string;
  handleClick: (hash: string, text: string) => (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isNested?: boolean;
}

const trackRouteNavigation = (text: string, trackingInfo: EventInfo | undefined) => {
  if (trackingInfo) {
    trackEvent({
      ...trackingInfo,
      action: 'Navigate with Table of Contents',
      label: `${trackingInfo.label} ${text}`,
    });
  }
};

function ItemLink({
  item,
  currentSection,
  handleClick,
  isNested = false,
  trackingInfo,
}: LinkProps & { item: TableOfContentsItem; trackingInfo?: EventInfo }) {
  const { icon: Icon, externalIcon, isRoute } = item;

  const handleClickInternal = useEventCallback(() => {
    if (isRoute) {
      trackRouteNavigation(item.text, trackingInfo);
    } else {
      handleClick(item.hash, item.text);
    }
  });

  return (
    <StyledItemLink
      display="flex"
      alignItems="center"
      gap={0.5}
      color={currentSection === item.hash ? 'textPrimary' : 'textSecondary'}
      href={isRoute ? item.hash : `#${item.hash}`}
      onClick={handleClickInternal}
      $isCurrentSection={currentSection === item.hash}
      $isNested={isNested}
    >
      {Icon && <Icon sx={{ fontSize: '1rem' }} color="primary" />}
      {externalIcon && (
        <StyledIconContainer>
          <ExternalImageIcon icon={externalIcon} />
        </StyledIconContainer>
      )}
      {item.text}
    </StyledItemLink>
  );
}

function ItemLinks({
  item,
  level = 0,
  ...rest
}: LinkProps & {
  level: number;
  item: TableOfContentsItem;
  trackingInfo?: EventInfo;
}) {
  const [open, setOpen] = useState(!item.initiallyClosed);

  const { items: subItems } = item;

  return (
    <>
      <ListItem
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          pl: level * 1,
          ...(level > 0 && { backgroundColor: theme.palette.secondaryContainer.main }),
        })}
        disableGutters
      >
        <ItemLink item={item} {...rest} />
        {subItems && (
          <IconButton
            size="small"
            onClick={() => {
              setOpen((value) => !value);
            }}
            color="primary"
            aria-label={open ? `Collapse section for ${item.text}` : `Expand section for ${item.text}`}
          >
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
      </ListItem>
      {subItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={level === 1 ? { marginBottom: 1 } : {}}>
            {subItems.map((subItem) => (
              <ItemLinks item={{ ...subItem }} key={`${subItem.text}-${subItem.hash}`} {...rest} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

function ItemSkeleton() {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={({ spacing }) => ({ margin: `${spacing(2)} 0px` })}>
      <Skeleton variant="circular" width={16} height={16} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={150} />
    </Stack>
  );
}

interface TableOfContentsProps {
  items: TableOfContentsItems;
  isLoading?: boolean;
  trackingInfo?: EventInfo;
  initialCurrentSection?: string;
  title?: string;
  titleHref?: string;
}

function TableOfContents({
  items,
  isLoading = false,
  trackingInfo,
  initialCurrentSection,
  title = 'Contents',
  titleHref,
}: TableOfContentsProps) {
  const [currentSection, setCurrentSection] = useState(initialCurrentSection || items[0]?.hash || '');

  const itemsWithNodeRef = useRef<TableOfContentsItems<TableOfContentsItemWithNode>>([]);

  useEffect(() => {
    itemsWithNodeRef.current = getItemsClient(items);
  }, [items]);

  const clickedRef = useRef(false);
  const unsetClickedRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findActiveIndex = useFindActiveIndex({ clickedRef, itemsWithNodeRef, currentSection, setCurrentSection });

  useThrottledOnScroll(items.length > 0 ? findActiveIndex : null, 200);

  const handleClick = useCallback(
    (hash: string, text: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      // Used to disable findActiveIndex if the page scrolls due to a click
      clickedRef.current = true;
      unsetClickedRef.current = setTimeout(() => {
        clickedRef.current = false;
      }, 1000);

      if (currentSection !== hash) {
        setCurrentSection(hash);
        if (trackingInfo) {
          trackEvent({
            ...trackingInfo,
            action: 'Navigate with Table of Contents',
            label: `${trackingInfo.label} ${text}`,
          });
        }
      }
    },
    [clickedRef, currentSection, trackingInfo, setCurrentSection],
  );

  React.useEffect(() => {
    if (unsetClickedRef.current) {
      clearTimeout(unsetClickedRef.current);
    }
  }, []);

  const position = useAnimatedSidebarPosition();

  if (!items || items.length === 0) {
    return null;
  }

  if (!position || !position.top) {
    return null;
  }

  return (
    <AnimatedNav
      data-testid="table-of-contents"
      style={{
        ...position,
        overflowX: 'hidden',
        position: 'sticky',
        width: '100%',
      }}
    >
      <TableTitle variant="h5" component={titleHref ? 'a' : 'div'} href={titleHref}>
        {title}
      </TableTitle>
      {isLoading ? (
        <>
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </>
      ) : (
        <List
          component="ul"
          sx={{
            overflowY: 'auto',
            // Make the maxHeight account for the header and some padding
            // This also makes the ToC scrollable if it exceeds the viewport height
            maxHeight: `calc(100dvh - ${position.top.animation.to as number}px - 32px)`,
          }}
        >
          {items.map((item) => (
            <ItemLinks
              item={item}
              currentSection={currentSection}
              handleClick={handleClick}
              key={`${item.hash}-${item.text}`}
              level={0}
              trackingInfo={trackingInfo}
            />
          ))}
        </List>
      )}
    </AnimatedNav>
  );
}

export default TableOfContents;
