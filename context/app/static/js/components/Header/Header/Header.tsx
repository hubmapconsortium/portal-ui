import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import { FixedHeightBanner } from 'js/components/Header/HeaderAppBar/style';
import { InfoIcon } from 'js/shared-styles/icons';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';
import { useEntityHeaderVisibility } from './hooks';

function Header() {
  const { shouldDisplayHeader, elevation, ...props } = useEntityHeaderVisibility();

  return (
    <>
      <FixedHeightBanner>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoIcon fontSize="0.85rem" />
          <Typography variant="button">
            This repository is under review for potential modification in compliance with Administration directives.
          </Typography>
        </Stack>
      </FixedHeightBanner>
      <HeaderAppBar elevation={elevation} {...props}>
        <HeaderContent />
      </HeaderAppBar>
      {shouldDisplayHeader && <EntityHeader />}
    </>
  );
}

export default Header;
