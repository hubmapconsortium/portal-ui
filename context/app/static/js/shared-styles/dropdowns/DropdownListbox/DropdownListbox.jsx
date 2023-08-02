import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUpRounded';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';

import { StyledPopper, StyledPaper } from './style';

function DropdownListbox({
  selectedOptionIndex,
  buttonComponent: SelectionButton,
  optionComponent: Option,
  buttonProps,
  options,
  selectOnClick,
  getOptionLabel,
  id,
}) {
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
        id={`${id}-button`}
        data-testid={`${id}-button`}
        aria-haspopup="listbox"
        disableElevation
        variant="contained"
        onClick={() => setIsOpen(true)}
        {...buttonProps}
      >
        {getOptionLabel(options[selectedOptionIndex], selectedOptionIndex)}
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </SelectionButton>
      <StyledPopper open={isOpen} anchorEl={anchorRef.current} placement="bottom-start">
        <StyledPaper>
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <MenuList role="listbox" id={`${id}-options`}>
              {options.map((option, i) => (
                <Option
                  onClick={selectedOptionIndex === i ? undefined : () => selectOption({ option, i })}
                  key={getOptionLabel(option)}
                  autoFocus={selectedOptionIndex === i}
                  selected={selectedOptionIndex === i}
                  aria-selected={selectedOptionIndex === i}
                >
                  {getOptionLabel(option, i)}
                </Option>
              ))}
            </MenuList>
          </ClickAwayListener>
        </StyledPaper>
      </StyledPopper>
    </>
  );
}

DropdownListbox.propTypes = {
  selectedOptionIndex: PropTypes.number.isRequired,
  buttonComponent: PropTypes.elementType.isRequired,
  optionComponent: PropTypes.elementType.isRequired,
  /* eslint-disable react/forbid-prop-types */
  buttonProps: PropTypes.object,
  options: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
  selectOnClick: PropTypes.func.isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

DropdownListbox.defaultProps = {
  buttonProps: {},
};

export default DropdownListbox;
