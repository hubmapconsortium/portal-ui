import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const StickyNav = styled('nav')({
  position: 'sticky',
});

const TableTitle = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledItemLink = styled(Link)<{ $isCurrentSection: boolean; $isNested: boolean }>(
  ({ theme, $isCurrentSection, $isNested }) => ({
    fontSize: theme.typography.body1.fontSize,
    lineHeight: 1.25,
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    borderLeft: '3px solid',
    ...($isNested && {
      marginLeft: theme.spacing(1),
    }),
    ...($isCurrentSection
      ? {
          color: theme.palette.info.main,
          borderColor: theme.palette.success.light,
        }
      : { borderColor: 'transparent', ':hover': { borderColor: theme.palette.secondary.light } }),
  }),
);

const StyledIconContainer = styled(Box)({
  width: '1rem',
  display: 'flex',
  '& > *': {
    width: '100%',
    height: '100%',
  },
});

export { StickyNav, TableTitle, StyledItemLink, StyledIconContainer };
