import { useState, useRef } from 'react';

function useMenu(initialState) {
  const menuRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(initialState || false);

  function openMenu() {
    setMenuIsOpen(true);
  }

  function closeMenu() {
    setMenuIsOpen(false);
  }

  return { menuRef, menuIsOpen, closeMenu, openMenu };
}

export default useMenu;
