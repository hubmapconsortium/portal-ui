import { styled } from '@mui/material/styles';

const Flex = styled('div')({
  display: 'flex',
  minWidth: 0,
});

const StyledDiv = styled('div')({
  minWidth: 0,
});

const StyledIconDiv = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
}));

interface BodyWrapperProps {
  $thumbnailDimension: number;
}

const BodyWrapper = styled('div')<BodyWrapperProps>(({ $thumbnailDimension }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: `${$thumbnailDimension}px`,
  boxSizing: 'content-box',
}));

export { Flex, StyledDiv, StyledIconDiv, BodyWrapper };
