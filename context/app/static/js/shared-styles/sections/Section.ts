import { styled } from '@mui/material/styles';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

const baseOffset = headerHeight + 10;

/* Anchor offset for fixed header to be used on pages with table of contents. */
const Section = styled('section')(({ theme }) => ({
  marginBottom: theme.spacing(5),
  scrollMarginTop: `${baseOffset}px`,
}));

export { baseOffset };
export default Section;
