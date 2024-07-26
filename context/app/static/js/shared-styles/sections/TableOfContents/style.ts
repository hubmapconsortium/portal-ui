import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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

export { StickyNav, TableTitle, StyledItemLink };
