import { styled } from '@mui/material/styles';

const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.common.hoverShadow}`,
  backgroundColor: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.common.hoverShadow,
  },
}));

const ImageWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  width: 'fit-content',
  height: 'fit-content',
  padding: theme.spacing(1.5, 2, 2.5),
}));

export { Flex, ImageWrapper };
