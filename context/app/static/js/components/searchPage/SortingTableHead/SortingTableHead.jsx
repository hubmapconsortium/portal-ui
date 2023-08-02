import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { trackEvent } from 'js/helpers/trackers';

import { getSortPairs } from '../utils';
import { ArrowUpOn, ArrowDownOn, ArrowDownOff, StyledHeaderCell } from './style';

function getOrder(orderPair, selectedItems) {
  if (selectedItems.length > 1) {
    console.warn('Expected only a single sort, not:', selectedItems);
  }
  const selectedItem = selectedItems.length ? selectedItems[0] : undefined;
  const match = orderPair.filter((item) => item.key === selectedItem);
  return match.length ? match[0].order : undefined;
}

function OrderIcon({ order }) {
  if (order === 'asc') return <ArrowUpOn />;
  if (order === 'desc') return <ArrowDownOn />;
  return <ArrowDownOff />;
}

OrderIcon.propTypes = {
  // eslint-disable-next-line react/require-default-props
  order: PropTypes.oneOf(['asc', 'desc']),
};

function SortingTableHead({ items, toggleItem, selectedItems, analyticsCategory }) {
  const pairs = getSortPairs(items);
  return (
    <TableHead>
      <TableRow>
        {pairs.map((pair) => {
          const order = getOrder(pair, selectedItems);
          return (
            <StyledHeaderCell
              role="button"
              key={pair[0].key}
              onClick={() => {
                trackEvent({
                  category: analyticsCategory,
                  action: `Sort Table View`,
                  label: `${pair[0].label} ${order && order === pair[0].order ? 'asc' : 'desc'}`,
                });
                toggleItem(pair[order && order === pair[0].order ? 1 : 0].key);
              }}
            >
              {pair[0].label} <OrderIcon order={order} />
            </StyledHeaderCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

SortingTableHead.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SortingTableHead;
export { getOrder }; // For tests
