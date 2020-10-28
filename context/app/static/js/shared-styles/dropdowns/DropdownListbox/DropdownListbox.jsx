import React, { useState, useRef } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUpRounded';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';

import { StyledPopper, StyledPaper } from './style';

function DropdownListbox(props) {
  const {
    selectedOptionIndex,
    buttonComponent: SelectionButton,
    optionComponent: Option,
    buttonProps,
    options,
    selectOnClick,
    getOptionLabel,
  } = props;
  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  function selectOption(option) {
    selectOnClick(option);
    setIsOpen(false);
  }

  return (
    <>
      <SelectionButton
        ref={anchorRef}
        aria-haspopup="listbox"
        disableElevation
        variant="contained"
        color="primary"
        onClick={() => setIsOpen(true)}
        {...buttonProps}
      >
        {getOptionLabel(options[selectedOptionIndex])} {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </SelectionButton>
      <StyledPopper open={isOpen} anchorEl={anchorRef.current} placement="bottom-start">
        <StyledPaper>
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <MenuList role="listbox">
              {options.map((option, i) => (
                <Option
                  onClick={() => selectOption({ option, i })}
                  key={getOptionLabel(option)}
                  autoFocus={selectedOptionIndex === i}
                  selected={selectedOptionIndex === i}
                  aria-selected={selectedOptionIndex === i}
                >
                  {getOptionLabel(option)}
                </Option>
              ))}
            </MenuList>
          </ClickAwayListener>
        </StyledPaper>
      </StyledPopper>
    </>
  );
}

export default DropdownListbox;
