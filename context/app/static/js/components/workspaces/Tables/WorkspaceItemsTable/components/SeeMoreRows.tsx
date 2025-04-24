import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSeeMoreRows } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { DownIcon } from 'js/shared-styles/icons';
import { StyledButton } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';

function SeeMoreRows({
  showSeeMoreOption,
  numVisibleItems,
  setNumVisibleItems,
  totalItems,
}: {
  showSeeMoreOption?: boolean;
  numVisibleItems: number;
  setNumVisibleItems: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
}) {
  const { trackSeeMoreClick } = useSeeMoreRows({ setNumVisibleItems });

  if (!showSeeMoreOption || numVisibleItems >= totalItems) {
    return null;
  }

  return (
    <StyledButton variant="text" onClick={trackSeeMoreClick} fullWidth>
      <Stack direction="row" spacing={1} marginY={0.5} alignItems="center">
        <Typography variant="button">See More</Typography>
        <DownIcon />
      </Stack>
    </StyledButton>
  );
}

export default SeeMoreRows;
