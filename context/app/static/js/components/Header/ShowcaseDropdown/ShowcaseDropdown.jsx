import React, { useReducer, useRef } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';

import ShowcaseLinks from '../ShowcaseLinks';
import { OffsetPopper } from './style';

function ShowcaseDropdown() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  return (
    <>
      <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }}>
        Showcases
        {open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </Button>
      <OffsetPopper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id="showcase-options">
              <ShowcaseLinks />
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </OffsetPopper>
    </>
  );
}

export default ShowcaseDropdown;
