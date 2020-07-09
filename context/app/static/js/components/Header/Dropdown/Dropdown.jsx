import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';

import { OffsetPopper } from './style';

function Dropdown(props) {
  const { title, children, menuListId } = props;
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  return (
    <>
      <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }}>
        {title}
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Button>
      <OffsetPopper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList id={menuListId}>{children}</MenuList>
          </ClickAwayListener>
        </Paper>
      </OffsetPopper>
    </>
  );
}

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  menuListId: PropTypes.string.isRequired,
};

export default Dropdown;
