import React from 'react';
import Typography from '@mui/material/Typography';
import { HeaderWrapper, HeaderWrapperProps } from 'js/shared-styles/tables/NumSelectedHeader/style';

interface NumSelectedHeaderProps extends HeaderWrapperProps {
  numSelected: number;
}

function formatNumSelected(numSelected: number): React.ReactNode {
  if (numSelected === 0) {
    return null;
  }
  return `${numSelected} Selected`;
}

function NumSelectedHeader({ numSelected, ...props }: NumSelectedHeaderProps) {
  return (
    <HeaderWrapper {...props}>
      <Typography
        fontWeight="500"
        sx={(theme) => ({ color: numSelected === 0 ? theme.palette.grey[500] : theme.palette.primary.main })}
      >
        {formatNumSelected(numSelected)}
      </Typography>
    </HeaderWrapper>
  );
}

export default NumSelectedHeader;
