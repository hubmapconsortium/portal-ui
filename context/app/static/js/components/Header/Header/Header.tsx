import React from 'react';
import Stack from '@mui/material/Stack';

import EntityHeader from 'js/components/detailPage/entityHeader/EntityHeader';
import { FixedHeightBanner } from 'js/components/Header/HeaderAppBar/style';
import { InfoIcon } from 'js/shared-styles/icons';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';
import { useEntityHeaderVisibility } from './hooks';
import { StyledTypography } from './style';

function Header() {
  const { shouldDisplayHeader, ...props } = useEntityHeaderVisibility();

  return (
    <>
      <FixedHeightBanner>
        <Stack direction="row" spacing={1} marginX={1} alignItems="center">
          <InfoIcon />
          <StyledTypography variant="button">
            This repository is under review for potential modification in compliance with Administration directives.
          </StyledTypography>
        </Stack>
      </FixedHeightBanner>
      <HeaderAppBar {...props}>
        <HeaderContent />
      </HeaderAppBar>
      {shouldDisplayHeader && <EntityHeader />}
    </>
  );
}

export default Header;
