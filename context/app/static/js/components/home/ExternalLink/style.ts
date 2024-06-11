import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const ExternalLinkContainer = styled(Stack)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.common.hoverShadow}`,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.hoverShadow,
  },
}));

const ImageWrapper = styled(Stack)(({ theme }) => ({
  width: 'fit-content',
  height: 'fit-content',
  padding: theme.spacing(1.5, 2, 2.5),
}));

export { ExternalLinkContainer, ImageWrapper };
