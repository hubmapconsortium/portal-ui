import React from 'react';
import Typography from '@mui/material/Typography';
import { HeaderWrapper, HeaderWrapperProps } from 'js/shared-styles/tables/NumSelectedHeader/style';

interface NumSelectedHeaderProps extends HeaderWrapperProps {
  numSelected: number;
}

function NumSelectedHeader({ numSelected, ...props }: NumSelectedHeaderProps) {
  return (
    <HeaderWrapper {...props}>
      <Typography
        fontWeight="500"
        sx={(theme) => ({ color: numSelected === 0 ? theme.palette.grey[500] : theme.palette.primary.main })}
      >
        {`${numSelected} selected`}
      </Typography>
    </HeaderWrapper>
  );
}

export default NumSelectedHeader;
