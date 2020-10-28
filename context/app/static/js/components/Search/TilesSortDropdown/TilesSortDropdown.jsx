import React from 'react';
import PropTypes from 'prop-types';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import useSearchViewStore from 'js/stores/useSearchViewStore';
import { StyledButton, StyledDropdownListboxOption } from './style';
import { getSortPairs } from '../utils';

const searchViewStoreSelector = (state) => state.searchView;

function getSelectedItemLabel(items, selectedItems) {
  if (selectedItems.length > 1) {
    console.warn('Expected only a single sort, not:', selectedItems);
  }
  const selectedItem = selectedItems.length ? selectedItems[0] : undefined;
  const match = items.filter((item) => item.key === selectedItem);
  return match.length ? match[0].label : '';
}

function TilesSortDropdown(props) {
  const { items, toggleItem, selectedItems } = props;
  const selectedItemLabel = getSelectedItemLabel(items, selectedItems);

  const searchView = useSearchViewStore(searchViewStoreSelector);

  const pairs = getSortPairs(items);
  function selectSortItem(pair) {
    // Sort everything in ascending order except for last modified
    const item = pair[0].field === 'mapped_last_modified_timestamp.keyword' ? pair[0] : pair[1];
    toggleItem(item.key);
  }

  return (
    <DropdownListbox
      buttonComponent={StyledButton}
      optionComponent={StyledDropdownListboxOption}
      selectedItemLabel={selectedItemLabel}
      buttonProps={{
        $searchView: searchView,
      }}
      options={pairs}
      selectOnClick={selectSortItem}
      getOptionLabel={(pair) => pair[0].label}
    />
  );
}

TilesSortDropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TilesSortDropdown;
