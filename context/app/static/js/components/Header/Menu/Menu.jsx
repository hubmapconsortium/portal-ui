import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/MenuRounded';
import CloseIcon from '@material-ui/icons/CloseRounded';
import MenuList from '@material-ui/core/MenuList';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';

import PreviewLinks from '../PreviewLinks';
import DocumentationLinks from '../DocumentationLinks';
import { WidePopper, WidePaper, DropdownMenuItem } from './style';
import DropdownLink from '../DropdownLink';

function Menu(props) {
  const [open, toggle] = useReducer((v) => !v, false);
  const [openPreview, togglePreview] = useReducer((v) => !v, false);
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
            {/* NOTE: Changes here should be in sync with HeaderContent.jsx. */}
            {['Donor', 'Sample', 'Dataset'].map((type) => (
              <DropdownLink key={type} href={`/search?entity_type[0]=${type}`}>{`${type}s`}</DropdownLink>
            ))}
            <DropdownLink href="/collections">Collections</DropdownLink>
            <DropdownMenuItem onClick={togglePreview}>
              Previews
              {openPreview ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </DropdownMenuItem>
            {openPreview && <PreviewLinks isIndented />}
            <DropdownMenuItem onClick={toggleDocumentation}>
              Documentation
              {openDocumentation ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </DropdownMenuItem>
            {openDocumentation && <DocumentationLinks isIndented />}
            <DropdownLink href="/ccf-eui">CCF</DropdownLink>
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
