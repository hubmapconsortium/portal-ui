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
  borderLeft: '3px solid', // TODO: Move to theme.
};

const StyledItemLink = styled(Link)<{ $isCurrentSection: boolean; $isNested: boolean }>(
  ({ theme, $isCurrentSection, $isNested }) => ({
    fontSize: theme.typography.body1.fontSize,
    lineHeight: 1.25,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    ...border,
    ...($isNested && {
      marginLeft: theme.spacing(1),
    }),
    ...($isCurrentSection
      ? {
          color: theme.palette.info.main,
          borderColor: theme.palette.success.main,
        }
      : { borderColor: 'transparent', ':hover': { borderColor: theme.palette.provenance.default } }),
  }),
);

export { TableContainer, StickyNav, TableTitle, StyledItemLink };
