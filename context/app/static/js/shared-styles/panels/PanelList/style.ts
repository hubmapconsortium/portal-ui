import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const PanelScrollBox = styled(Paper)(({ theme }) => {
  const media = `@media (min-width: ${theme.breakpoints.values.md}px)`;
  return {
    [media]: {
      flexGrow: 1,
      overflowY: 'scroll',
      maxHeight: '400px',
    },
  };
});

// Wraps the (non-scrolling) header row. The item list above reserves space for its scrollbar on md+
// (PanelScrollBox is `overflow-y: scroll`), making the rows narrower than the full-width header;
// flex-grow then shifts the header's later column labels right of the row content. Reserving the
// same scrollbar gutter here gives the header and rows identical column geometry so the labels line
// up. (`overflow: hidden` only clips the row's horizontal margin overflow; the header never scrolls.)
const PanelHeaderBox = styled('div')(({ theme }) => ({
  [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
    overflow: 'hidden',
    scrollbarGutter: 'stable',
  },
}));

export { PanelScrollBox, PanelHeaderBox };
