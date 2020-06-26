import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Link from '@material-ui/core/Link';
import { AppBar } from '@material-ui/core';

import ShowcaseLinks from '../ShowcaseLinks';
import { WidePopper, WidePaper, ShowcaseMenuItem } from './style';

function Menu(props) {
  const [open, toggle] = useReducer((v) => !v, false);
  const [openShowcase, toggleShowcase] = useReducer((v) => !v, false);
  const { anchorRef } = props;

  return (
    <>
      <IconButton color="inherit" aria-describedby="main-menu" aria-haspopup="true" onClick={toggle}>
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <WidePopper id="main-menu" open={open} anchorEl={anchorRef.current}>
        <WidePaper>
          <MenuList>
            {['Donor', 'Sample', 'Dataset'].map((type) => (
              <MenuItem key={type}>
                <Link href={`/search?entity_type[0]=${type}`} color="primary" underline="none">{`${type}s`}</Link>
              </MenuItem>
            ))}
            <MenuItem>
              <Link href="/collections">Collections</Link>
            </MenuItem>
            <ShowcaseMenuItem onClick={toggleShowcase}>
              Showcases
              {openShowcase ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </ShowcaseMenuItem>
            {openShowcase && <ShowcaseLinks />}
            <MenuItem>
              <Link href="/ccf-eui" target="_blank" rel="noopener noreferrer" color="primary" underline="none">
                CCF
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href="/help" color="primary" underline="none">
                Help
              </Link>
            </MenuItem>
          </MenuList>
        </WidePaper>
      </WidePopper>
    </>
  );
}

Menu.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.instanceOf(AppBar) }).isRequired,
};

export default Menu;
