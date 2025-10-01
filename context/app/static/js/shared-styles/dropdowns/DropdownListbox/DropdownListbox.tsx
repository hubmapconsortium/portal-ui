import React, { useState, useRef } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUpRounded';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useEventCallback } from '@mui/material/utils';
import { StyledPopper, StyledPaper } from './style';

interface DropdownListboxProps<T> {
  selectedOptionIndex: number;
  buttonComponent: React.ElementType;
  optionComponent: React.ElementType;
  buttonProps?: Record<string, unknown>;
  options: T[];
  selectOnClick: ({ option, i }: { option: T; i: number }) => void;
  getOptionLabel: (option: T) => React.ReactNode;
  id: string;
}

function DropdownListbox<T>({
  selectedOptionIndex,
  buttonComponent: SelectionButton,
  optionComponent: Option,
  buttonProps,
  options,
  selectOnClick,
  getOptionLabel,
  id,
}: DropdownListboxProps<T>) {
  const anchorRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectOption = useEventCallback((selectedItem: { option: T; i: number }) => {
    selectOnClick(selectedItem);
    setIsOpen(false);
  });

  return (
    <>
      <SelectionButton
        ref={anchorRef}
        id={`${id}-button`}
        data-testid={`${id}-button`}
        aria-haspopup="listbox"
        disableElevation
        variant="contained"
        onClick={() => {
          setIsOpen(true);
        }}
        {...buttonProps}
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Typography variant="inherit" flexGrow={1} display="flex" justifyContent="center">
            {getOptionLabel(options[selectedOptionIndex])}
          </Typography>
          {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Stack>
      </SelectionButton>
      <StyledPopper open={isOpen} anchorEl={anchorRef.current} placement="bottom-start">
        <StyledPaper>
          <ClickAwayListener
            onClickAway={() => {
              setIsOpen(false);
            }}
          >
            <MenuList role="listbox" id={`${id}-options`}>
              {options.map((option, i) => (
                <Option
                  onClick={
                    selectedOptionIndex === i
                      ? undefined
                      : () => {
                          selectOption({ option, i });
                        }
                  }
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
