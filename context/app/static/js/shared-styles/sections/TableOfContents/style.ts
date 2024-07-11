import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const TableContainer = styled('div')({
  marginRight: '8px',
  height: '100%',
});

const StickyNav = styled('nav')({
  position: 'sticky',
});

const TableTitle = styled(Typography)({
  marginLeft: '7px',
});

const border = {
  borderLeft: '3px solid #c4c4c4', // TODO: Move to theme.
};

const StyledItemLink = styled(Link)<{ $isCurrentSection: boolean }>(({ theme, $isCurrentSection }) => ({
  fontSize: theme.typography.body1.fontSize,
  lineHeight: 1.25,
  paddingBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(0.5),
  borderLeft: '3px solid transparent',
  marginBottom: theme.spacing(0.5),

  '&:hover': border,
  ...($isCurrentSection && {
    color: theme.palette.info.main,
    ...border, // TODO: Move to theme.
  }),
}));

export { TableContainer, StickyNav, TableTitle, StyledItemLink };
