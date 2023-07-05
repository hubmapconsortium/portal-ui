import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';

import { OffsetPopper } from './style';

function Dropdown({ title, children, menuListId, ...rest }) {
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  return (
    <>
      <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }} {...rest}>
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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Dropdown;
