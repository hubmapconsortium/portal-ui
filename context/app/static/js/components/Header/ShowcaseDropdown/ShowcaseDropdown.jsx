import React, { useReducer, useRef } from 'react';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Paper from '@material-ui/core/Paper';

import ShowcaseLinks from '../ShowcaseLinks';

function ShowcaseDropdown() {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  return (
    <>
      <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }}>
        Showcases
        {open ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id="showcase-options">
              <ShowcaseLinks />
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

export default ShowcaseDropdown;
