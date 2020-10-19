import React, { useRef, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import useSearchViewStore from 'js/stores/useSearchViewStore';
import { SelectionButton } from './style';
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
  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { items, toggleItem, selectedItems } = props;
  const [selectedItemLabel, setSelectedItemLabel] = useState(getSelectedItemLabel(items, selectedItems));
  const searchView = useSearchViewStore(searchViewStoreSelector);

  const pairs = getSortPairs(items);
  function selectSortItem(pair) {
    // Sort everything in ascending order except for last modified
    const item = pair[0].field === 'mapped_last_modified_timestamp.keyword' ? pair[0] : pair[1];
    toggleItem(item.key);
    setSelectedItemLabel(item.label);
    setIsOpen(false);
  }

  return (
    <>
      <SelectionButton
        ref={anchorRef}
        style={{ borderRadius: 3 }}
        onClick={() => setIsOpen(true)}
        disableElevation
        variant="contained"
        color="primary"
        searchView={searchView}
      >
        {selectedItemLabel} {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </SelectionButton>
      <Popper open={isOpen} anchorEl={anchorRef.current} placement="bottom-start" style={{ zIndex: 50 }}>
        <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <MenuList id="preview-options">
              {pairs.map((pair) => (
                <MenuItem onClick={() => selectSortItem(pair)} key={pair[0].field}>
                  {pair[0].label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

export default TilesSortDropdown;
