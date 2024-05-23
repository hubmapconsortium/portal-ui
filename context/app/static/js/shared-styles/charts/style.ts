import { styled } from '@mui/material/styles';

interface TitleWrapperProps {
  $leftOffset?: number;
}

const TitleWrapper = styled('div')({ $leftOffset: 0 }, ({ $leftOffset }: TitleWrapperProps) => ({
  paddingLeft: $leftOffset,
}));

export { TitleWrapper };
