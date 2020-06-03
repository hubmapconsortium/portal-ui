import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import { throttle } from '../../helpers/functions';

const TableContainer = styled.div`
  margin-right: 70px;
  width: 80px;
`;

const StickyNav = styled.nav`
  position: sticky;
  top 70px;
`;

const TableTitle = styled(Typography)`
  margin-left: 7px;
`;

const StyledItemLink = styled(Link)`
  font-size: 0.8125rem;
  line-height: 2;
  padding-left: 4px;
  border-left: 3px solid transparent;
  &:hover {
    border-left: 3px solid #c4c4c4;
  }
  ${(props) =>
    props.$isCurrentSection &&
    css`
      color: #3781d1;
      border-left: 3px solid #c4c4c4;
    `};
`;

function ItemLink(props) {
  const { item, currentSection, handleClick } = props;
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

function TableOfContents(props) {
  const { items } = props;
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

  return (
    <TableContainer>
      <StickyNav>
        {items.length > 0 ? (
          <>
            <TableTitle>Sections</TableTitle>
            <List component="ul">
              {items.map((item) => (
                <li key={item.text}>
                  <ItemLink item={item} currentSection={currentSection} handleClick={handleClick} />
                </li>
              ))}
            </List>
          </>
        ) : null}
      </StickyNav>
    </TableContainer>
  );
}

TableOfContents.propTypes = {
  items: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default TableOfContents;
