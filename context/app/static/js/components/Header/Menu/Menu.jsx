import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/MenuRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';

import ResourceLinks from '../ResourceLinks';
import DocumentationLinks from '../DocumentationLinks';
import { WidePopper, WidePaper, DropdownMenuItem } from './style';
import DropdownLink from '../DropdownLink';
import AtlasToolsLinks from '../AtlasToolsLinks';

function Menu(props) {
  const [open, toggle] = useReducer((v) => !v, false);
  const [openResources, toggleResources] = useReducer((v) => !v, false);
  const [openAtlasTools, toggleAtlasTools] = useReducer((v) => !v, false);
  const [openDocumentation, toggleDocumentation] = useReducer((v) => !v, false);
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
              <DropdownLink key={type} href={`/search?entity_type[0]=${type}`}>{`${type}s`}</DropdownLink>
            ))}
            <DropdownLink href="/collections">Collections</DropdownLink>
            {[
              [toggleResources, 'Resources', openResources, ResourceLinks],
              [toggleAtlasTools, 'Atlas & Tools', openAtlasTools, AtlasToolsLinks],
              [toggleDocumentation, 'Documentation', openDocumentation, DocumentationLinks],
            ].map(([onClick, label, isOpen, Component]) => (
              <>
                <DropdownMenuItem onClick={onClick}>
                  {label}
                  {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </DropdownMenuItem>
                {isOpen && <Component isIndented />}
              </>
            ))}
          </MenuList>
          <DropdownLink href="/my-lists">My Lists</DropdownLink>
        </WidePaper>
      </WidePopper>
    </>
  );
}

Menu.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
};

export default Menu;
