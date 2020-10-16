import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { ArrowUpOn, ArrowDownOn, ArrowDownOff, StyledHeaderCell } from '../style';
import { getSortPairs } from '../utils';

import { StyledTableHead } from './style';

const searchViewStoreSelector = (state) => state.searchView;

function getOrder(orderPair, selectedItems) {
  if (selectedItems.length > 1) {
    console.warn('Expected only a single sort, not:', selectedItems);
  }
  const selectedItem = selectedItems.length ? selectedItems[0] : undefined;
  const match = orderPair.filter((item) => item.key === selectedItem);
  return match.length ? match[0].order : undefined;
}

function OrderIcon(props) {
  const { order } = props;
  if (order === 'asc') return <ArrowUpOn />;
  if (order === 'desc') return <ArrowDownOn />;
  return <ArrowDownOff />;
}

OrderIcon.propTypes = {
  // eslint-disable-next-line react/require-default-props
  order: PropTypes.oneOf(['asc', 'desc']),
};

function SortingTableHead(props) {
  const { items, toggleItem, selectedItems } = props;

  const searchView = useSearchViewStore(searchViewStoreSelector);

  const pairs = getSortPairs(items);
  return (
    <StyledTableHead searchView={searchView}>
      <TableRow>
        {pairs.map((pair) => {
          const order = getOrder(pair, selectedItems);
          return (
            <StyledHeaderCell
              role="button"
              key={pair[0].key}
              onClick={() => {
                toggleItem(pair[order && order === pair[0].order ? 1 : 0].key);
              }}
            >
              {pair[0].label} <OrderIcon order={order} />
            </StyledHeaderCell>
          );
        })}
      </TableRow>
    </StyledTableHead>
  );
}

SortingTableHead.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SortingTableHead;
export { getOrder }; // For tests
