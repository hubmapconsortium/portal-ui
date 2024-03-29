import React, { useState } from 'react';
import List from '@mui/material/List';
import { useSpring, animated } from '@react-spring/web';

import useEntityStore from 'js/stores/useEntityStore';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { throttle } from 'js/helpers/functions';
import { TableContainer, StickyNav, TableTitle, StyledItemLink } from './style';

const AnimatedNav = animated(StickyNav);
const entityStoreSelector = (state) => state.summaryComponentObserver;

function ItemLink({ item, currentSection, handleClick }) {
  return (
    <StyledItemLink
      display="block"
      color={currentSection === item.hash ? 'textPrimary' : 'textSecondary'}
      href={`#${item.hash}`}
      underline="none"
      onClick={handleClick(item.hash)}
      $isCurrentSection={currentSection === item.hash}
    >
      {item.text}
    </StyledItemLink>
  );
}

function getItemsClient(headings) {
  const itemsWithNode = [];

  headings.forEach((item) => {
    itemsWithNode.push({
      ...item,
      node: document.getElementById(item.hash),
    });
  });
  return itemsWithNode;
}

function useThrottledOnScroll(callback, delay) {
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

function TableOfContents({ items }) {
  const [currentSection, setCurrentSection] = useState(items[0].hash);

  const itemsWithNodeRef = React.useRef([]);
  React.useEffect(() => {
    itemsWithNodeRef.current = getItemsClient(items);
  }, [items]);

  const clickedRef = React.useRef(false);
  const unsetClickedRef = React.useRef(null);

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

  const handleClick = (hash) => (event) => {
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
      clearTimeout(unsetClickedRef.current);
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
    <TableContainer data-testid="table-of-contents">
      <AnimatedNav style={stickyNavAnimationProps}>
        <TableTitle variant="h5" component="h3">
          Sections
        </TableTitle>
        <List component="ul">
          {items.map((item) => (
            <li key={item.text}>
              <ItemLink item={item} currentSection={currentSection} handleClick={handleClick} />
            </li>
          ))}
        </List>
      </AnimatedNav>
    </TableContainer>
  );
}

export default TableOfContents;
