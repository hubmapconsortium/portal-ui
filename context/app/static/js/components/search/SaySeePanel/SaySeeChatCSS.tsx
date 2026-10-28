import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';

// udi-yac's markdown renderer sets the marker on the list itself (Tailwind's
// `udi:list-disc` / `udi:list-decimal` on the <ul>/<ol>) and leaves each <li>
// unstyled, letting it inherit. The portal's global `li { list-style: none }`
// reset in js/components/globalStyles.tsx matches the <li> directly, and a
// direct match always beats an inherited value -- regardless of specificity
// or cascade layer -- so chat bullets disappear.
//
// `inherit` hands each <li> back to whatever its parent list says: disc,
// decimal, or none. That reproduces udi-yac's standalone rendering exactly,
// including nested mixed lists, rather than hardcoding one marker here.
//
// Scoped to `.udi-yac`, the class udi-yac puts on its own root element
// (added in 0.3.0), so nothing outside the chat is affected.
//
// In dark mode, udi-yac's neutral surfaces start near black. They are moved onto the portal's #333 surface so the
// chat matches the visualization container around it. The doubled class outranks udi-yac's own `.udi-yac.dark`
// rule, which loads later (in vendors.css).
const saySeeChatStyles = {
  '.udi-yac li': {
    listStyle: 'inherit',
  },
  '.udi-yac.udi-yac.dark': {
    '--background': '#333333',
    '--card': '#3c3c3c',
    '--popover': '#3c3c3c',
    '--sidebar': '#3c3c3c',
    '--secondary': '#474747',
    '--muted': '#474747',
    '--accent': '#474747',
  },
} as const;

export default function SaySeeChatCSS() {
  return <GlobalStyles styles={saySeeChatStyles} />;
}
