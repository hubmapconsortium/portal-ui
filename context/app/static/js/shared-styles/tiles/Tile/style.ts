import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface TileProps {
  $tileWidth?: number;
  $invertColors?: boolean;
}

function invertSectionColors(backgroundColor: string, color: string, $invertColors?: boolean) {
  if (!$invertColors) {
    return {
      backgroundColor,
      color,
      '& svg': {
        color,
      },
    };
  }

  return {
    backgroundColor: color,
    color: backgroundColor,
    '& svg': {
      color: backgroundColor,
    },
  };
}

const StyledPaper = styled(Paper)<TileProps>(({ theme, $tileWidth = 225, $invertColors = false }) => ({
  marginBottom: theme.spacing(1),
  boxShadow: theme.shadows[1],
  width: $tileWidth,
  ...invertSectionColors(theme.palette.white.main, theme.palette.primary.main, $invertColors),
  '&:hover': {
    boxShadow: theme.shadows[8],
    filter: $invertColors ? 'brightness:108%' : 'brightness(96%)',
  },
}));

const FlexGrow = styled('div')({
  flexGrow: 1,
  minWidth: 0,
});

const TruncatedTypography = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
` as typeof Typography;

const TileFooter = styled('div')<TileProps>(({ theme, $invertColors }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...invertSectionColors(theme.palette.primary.main, theme.palette.white.main, $invertColors),
}));

const StyledDivider = styled(Divider)<TileProps>(({ theme, $invertColors = false }) => ({
  backgroundColor: $invertColors ? theme.palette.primary.main : theme.palette.white.main,
  margin: theme.spacing(0, 0.5),
}));

export { StyledPaper, invertSectionColors, FlexGrow, TruncatedTypography, TileFooter, StyledDivider };
