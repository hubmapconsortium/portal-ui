import React, { ComponentProps } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Flex } from './style';

interface SectionButtonRowProps extends ComponentProps<typeof Flex> {
  /**
   Text to be displayed in the left most available space. Usually a BottomAlignedTypography component.
  */
  leftText: React.ReactNode;
  /**
   Button(s) to be displayed in the right most available space.
  */
  buttons?: React.ReactNode;
}

function SectionButtonRow({ leftText = <div />, buttons, ...props }: SectionButtonRowProps) {
  return (
    <Flex {...props}>
      {leftText}
      {buttons && <Stack direction="row">{buttons}</Stack>}
    </Flex>
  );
}

const SpacedSectionButtonRow = styled(SectionButtonRow)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  minHeight: theme.spacing(5),
}));

const BottomAlignedTypography = styled(Typography)({
  alignSelf: 'flex-end',
});

export { SpacedSectionButtonRow, BottomAlignedTypography };
export default SectionButtonRow;
