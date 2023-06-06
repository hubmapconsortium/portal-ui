import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from 'js/helpers/trackers';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { StyledButton, StyledDropdownListboxOption } from './style';
import { getSortPairs } from '../utils';

const searchViewStoreSelector = (state) => state.searchView;

function getSelectedItemIndex(pairs, selectedItems) {
  if (selectedItems.length > 1) {
    console.warn('Expected only a single sort, not:', selectedItems);
  }
  const selectedItem = selectedItems.length ? selectedItems[0] : undefined;
  return pairs.findIndex((item) => [item[0].key, item[1].key].includes(selectedItem));
}

function TilesSortDropdown({ items, toggleItem, selectedItems, analyticsCategory }) {
  const pairs = getSortPairs(items);
  const selectedItemIndex = getSelectedItemIndex(pairs, selectedItems);

  const searchView = useSearchViewStore(searchViewStoreSelector);

  const selectSortItem = useCallback(
    function selectSortItem(itemAndIndex) {
      const pair = itemAndIndex.option;
      // Sort everything in ascending order except for last modified
      const item = pair[0].field === 'mapped_last_modified_timestamp.keyword' ? pair[0] : pair[1];
      toggleItem(item.key);
      trackEvent({
        category: analyticsCategory,
        action: `Sort Tile View`,
        label: `${pair[0].label} ${pair[0].field === 'mapped_last_modified_timestamp.keyword' ? 'desc' : 'asc'}`,
      });
    },
    [analyticsCategory, toggleItem],
  );

  return (
    <DropdownListbox
      buttonComponent={StyledButton}
      optionComponent={StyledDropdownListboxOption}
      selectedOptionIndex={selectedItemIndex}
      buttonProps={{
        $searchView: searchView,
        color: 'primary',
      }}
      options={pairs}
      selectOnClick={selectSortItem}
      getOptionLabel={(pair) => pair[0].label}
      id="search-tiles-sort"
    />
  );
}

TilesSortDropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TilesSortDropdown;
