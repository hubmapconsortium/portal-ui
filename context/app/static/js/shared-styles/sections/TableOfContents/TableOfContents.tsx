import React, { useCallback, useState } from 'react';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { animated } from '@react-spring/web';

import { StickyNav, TableTitle, StyledItemLink } from './style';
import { TableOfContentsItem, TableOfContentsItems, TableOfContentsItemWithNode } from './types';
import { getItemsClient } from './utils';
import { useThrottledOnScroll, useFindActiveIndex, useAnimatedSidebarPosition } from './hooks';

const AnimatedNav = animated(StickyNav);

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

function TableOfContents({ items, isLoading = false }: { items: TableOfContentsItems; isLoading?: boolean }) {
  const [currentSection, setCurrentSection] = useState(items[0].hash);

  const itemsWithNodeRef = React.useRef<TableOfContentsItems<TableOfContentsItemWithNode>>([]);

  React.useEffect(() => {
    itemsWithNodeRef.current = getItemsClient(items);
  }, [items]);

  const clickedRef = React.useRef(false);
  const unsetClickedRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const findActiveIndex = useFindActiveIndex({ clickedRef, itemsWithNodeRef, currentSection, setCurrentSection });

  useThrottledOnScroll(items.length > 0 ? findActiveIndex : null, 200);

  const handleClick = useCallback(
    (hash: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
    },
    [clickedRef, currentSection, setCurrentSection],
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

  if (!position) {
    return null;
  }

  return (
    <Box data-testid="table-of-contents" height="100%" mr={1}>
      <AnimatedNav style={position}>
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
                key={`${item.hash}-${item.text}`}
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
