import React, { useState } from 'react';
import List from '@mui/material/List';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { useSpring, animated } from '@react-spring/web';

import useEntityStore, { EntityStore } from 'js/stores/useEntityStore';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { throttle } from 'js/helpers/functions';
import { StickyNav, TableTitle, StyledItemLink } from './style';

export interface TableOfContentsItem {
  text: string;
  hash: string;
  icon?: typeof SvgIcon;
  items?: TableOfContentsItem[];
}

export interface TableOfContentsItemWithNode extends TableOfContentsItem {
  node: ReturnType<typeof document.getElementById>;
}

export type TableOfContentsItems<I = TableOfContentsItem> = I[];

const AnimatedNav = animated(StickyNav);
const entityStoreSelector = (state: EntityStore) => state.summaryComponentObserver;

interface LinkProps {
  currentSection: string;
  handleClick: (hash: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  isNested?: boolean;
}

function ItemLink({ item, currentSection, handleClick, isNested = false }: LinkProps & { item: TableOfContentsItem }) {
  const { icon: Icon } = item;

  return (
    <StyledItemLink
      display="flex"
      alignItems="center"
      gap={0.5}
      color={currentSection === item.hash ? 'textPrimary' : 'textSecondary'}
      href={`#${item.hash}`}
      onClick={handleClick(item.hash)}
      $isCurrentSection={currentSection === item.hash}
      $isNested={isNested}
    >
      {Icon && <Icon sx={{ fontSize: '1rem' }} color="primary" />}
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
}) {
  const [open, setOpen] = useState(true);

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
          <IconButton size="small" onClick={() => setOpen((value) => !value)} color="primary">
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        )}
      </ListItem>
      {subItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding sx={level === 1 ? { marginBottom: 1 } : {}}>
            {subItems.map((subItem) => (
              <ItemLinks item={{ ...subItem }} key={subItem.text} {...rest} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

function getItemsClient(items: TableOfContentsItems): TableOfContentsItems<TableOfContentsItemWithNode> {
  return items.map((item) => ({
    text: item.text,
    hash: item.hash,
    node: document.getElementById(item.hash),
    icon: item.icon,
    ...(item?.items && { items: getItemsClient(item.items) }),
  }));
}

function useThrottledOnScroll(callback: (() => void) | null, delay: number) {
  const throttledCallback = React.useMemo(() => (callback ? throttle(callback, delay) : null), [callback, delay]);

  React.useEffect(() => {
    if (throttledCallback === null) {
      return undefined;
    }

    window.addEventListener('scroll', throttledCallback);
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
}

function ItemSkeleton() {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={({ spacing }) => ({ margin: `${spacing(2)} 0px` })}>
      <Skeleton variant="circular" width={16} height={16} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={150} />
    </Stack>
  );
}

function TableOfContents({ items, isLoading = false }: { items: TableOfContentsItems; isLoading?: boolean }) {
  const [currentSection, setCurrentSection] = useState(items[0].hash);

  const itemsWithNodeRef = React.useRef<
    (TableOfContentsItem & {
      node: HTMLElement | null;
    })[]
  >([]);

  React.useEffect(() => {
    itemsWithNodeRef.current = getItemsClient(items);
  }, [items]);

  const clickedRef = React.useRef(false);
  const unsetClickedRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const findActiveIndex = React.useCallback(() => {
    // Don't set the active index based on scroll if a link was just clicked
    if (clickedRef.current) {
      return;
    }

    let active;
    const d = document.documentElement;

    for (let i = itemsWithNodeRef.current.length - 1; i >= 0; i -= 1) {
      const item = itemsWithNodeRef.current[i];

      if (item.node && item.node.offsetTop < d.scrollTop + d.clientHeight / 8) {
        active = item;
        break;
      }
    }

    if (active && currentSection !== active.hash) {
      setCurrentSection(active.hash);
    }
  }, [currentSection]);

  useThrottledOnScroll(items.length > 0 ? findActiveIndex : null, 200);

  const handleClick = (hash: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
    }
  };

  React.useEffect(
    () => () => {
      if (unsetClickedRef.current) {
        clearTimeout(unsetClickedRef.current);
      }
    },
    [],
  );

  const { summaryInView } = useEntityStore(entityStoreSelector);
  const initialHeightOffset = headerHeight + 16;
  const top = summaryInView ? `${initialHeightOffset}px` : `${initialHeightOffset + entityHeaderHeight}px`;
  const stickyNavAnimationProps = useSpring({ top });

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box data-testid="table-of-contents" height="100%" mr={1}>
      <AnimatedNav style={stickyNavAnimationProps}>
        <TableTitle variant="h5">Contents</TableTitle>
        {isLoading ? (
          <>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </>
        ) : (
          <List component="ul">
            {items.map((item) => (
              <ItemLinks
                item={item}
                currentSection={currentSection}
                handleClick={handleClick}
                key={item.text}
                level={0}
              />
            ))}
          </List>
        )}
      </AnimatedNav>
    </Box>
  );
}

export default TableOfContents;
