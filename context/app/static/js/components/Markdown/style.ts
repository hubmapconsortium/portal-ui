import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// Per-element styles (heading sizes, list bullets, link colors, table
// borders, etc.) live in MarkdownRenderer's `components` overrides so
// they don't depend on the CSS cascade through this wrapper. Keep the
// Paper styling minimal: just the surrounding spacing.
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 5),
}));

export { StyledPaper };
