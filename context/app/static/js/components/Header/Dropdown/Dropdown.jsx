import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUpRounded';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';

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
