import React from 'react';

import Box from '@mui/material/Box';
import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';
import { useEntityHeaderVisibility } from './hooks';

function Header() {
  const { shouldDisplayHeader, ...props } = useEntityHeaderVisibility();

  return (
    <Box sx={(theme) => ({ position: 'fixed', width: '100%', zIndex: theme.zIndex.header })}>
      <HeaderAppBar {...props}>
        <HeaderContent />
      </HeaderAppBar>
      {shouldDisplayHeader && <EntityHeader />}
    </Box>
  );
}

export default Header;
