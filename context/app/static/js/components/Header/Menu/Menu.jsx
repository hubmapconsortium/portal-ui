import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import MenuList from '@mui/material/MenuList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUpRounded';

import { WidePopper, WidePaper, DropdownMenuItem } from './style';
import DropdownLink from '../DropdownLink';

import { AtlasToolsLinks, OtherLinks, ResourceLinks } from '../staticLinks';

function DropdownContainer({ label, children }) {
  const [isOpen, toggle] = useReducer((v) => !v, false);

  return (
    <>
      <DropdownMenuItem onClick={toggle}>
        {label}
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </DropdownMenuItem>
      {isOpen && children}
    </>
  );
}

function Menu({ anchorRef }) {
  const [isOpen, toggle] = useReducer((v) => !v, false);

  return (
    <>
      <IconButton color="inherit" aria-describedby="main-menu" aria-haspopup="true" onClick={toggle} size="large">
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <WidePopper id="main-menu" open={isOpen} anchorEl={anchorRef.current}>
        <WidePaper>
          <MenuList>
            {['Donor', 'Sample', 'Dataset'].map((type) => (
              <DropdownLink key={type} href={`/search?entity_type[0]=${type}`}>{`${type}s`}</DropdownLink>
            ))}
            {[
              ['Other', OtherLinks],
              ['Atlas & Tools', AtlasToolsLinks],
              ['Resources', ResourceLinks],
            ].map(([label, Component]) => (
              <DropdownContainer label={label} key={label}>
                <Component isIndented />
              </DropdownContainer>
            ))}
          </MenuList>
        </WidePaper>
      </WidePopper>
    </>
  );
}

Menu.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
};

export default Menu;
