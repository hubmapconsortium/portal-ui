import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import { StyledPaper, FlexGrow, TruncatedTypography, TileFooter, StyledDivider } from './style';

interface TileProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  invertColors?: boolean;
  bodyContent: React.ReactNode;
  footerContent: React.ReactNode;
  tileWidth: number;
}

function Tile({
  href,
  icon,
  invertColors = false,
  bodyContent,
  footerContent,
  tileWidth,
  onClick,
  ...rest
}: TileProps) {
  const tile = (
    <StyledPaper $invertColors={invertColors} $tileWidth={tileWidth} onClick={onClick} {...rest}>
      <Stack p={1} boxSizing="content-box" direction="row">
        {icon}
        <FlexGrow>{bodyContent}</FlexGrow>
      </Stack>
      <TileFooter $invertColors={invertColors}>{footerContent}</TileFooter>
    </StyledPaper>
  );
  if (href) {
    return <a href={href}>{tile}</a>;
  }
  return tile;
}

Tile.Title = function TileTitle({ children }: PropsWithChildren) {
  return (
    <TruncatedTypography component="h4" variant="h6">
      {children}
    </TruncatedTypography>
  );
};

Tile.Text = function TileText({ children }: PropsWithChildren) {
  return <TruncatedTypography variant="body2">{children}</TruncatedTypography>;
};

Tile.Divider = function TileDivider({ invertColors }: Pick<TileProps, 'invertColors'>) {
  return <StyledDivider flexItem orientation="vertical" $invertColors={invertColors} />;
};

export default Tile;
