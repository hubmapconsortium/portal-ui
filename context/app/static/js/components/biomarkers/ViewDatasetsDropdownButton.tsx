import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';
import { getSearchURL, SCFindParams } from '../organ/utils';
import { ViewDatasetsButton } from '../organ/OrganCellTypes/ViewIndexedDatasetsButton';

const menuId = 'view-datasets-modality-menu';

// Match OutlinedButton's border style
const StyledDropdownMenuButton = styled(DropdownMenuButton)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
  borderRadius: theme.spacing(0.5),
}));

interface ModalityMenuItemProps {
  label: string;
  scFindParams: SCFindParams;
  trackingInfo?: EventInfo;
}

function ModalityMenuItem({ label, scFindParams, trackingInfo }: ModalityMenuItemProps) {
  const { closeMenu } = useDropdownMenuStore();

  const href = getSearchURL({ entityType: 'Dataset', scFindParams });

  const handleClick = () => {
    if (trackingInfo) {
      trackEvent({
        ...trackingInfo,
        action: `${trackingInfo.action} / ${label}`,
      });
    }
    closeMenu();
  };

  return (
    <MenuItem component="a" href={href} onClick={handleClick}>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );
}

interface ViewDatasetsDropdownInnerProps {
  baseParams: SCFindParams;
  trackingInfo?: EventInfo;
}

function ViewDatasetsDropdownInner({ baseParams, trackingInfo }: ViewDatasetsDropdownInnerProps) {
  return (
    <>
      <StyledDropdownMenuButton menuID={menuId} variant="outlined">
        View Datasets
      </StyledDropdownMenuButton>
      <DropdownMenu id={menuId}>
        <ModalityMenuItem
          label="All Modalities"
          scFindParams={{ ...baseParams, allModalities: true }}
          trackingInfo={trackingInfo}
        />
        <ModalityMenuItem label="RNA Datasets" scFindParams={baseParams} trackingInfo={trackingInfo} />
        <ModalityMenuItem
          label="ATAC Datasets"
          scFindParams={{ ...baseParams, modality: 'ATAC' }}
          trackingInfo={trackingInfo}
        />
      </DropdownMenu>
    </>
  );
}

const ViewDatasetsDropdown = withDropdownMenuProvider(ViewDatasetsDropdownInner, false);

export interface ViewDatasetsDropdownButtonProps {
  baseParams: SCFindParams;
  hasScfindRna?: boolean | null;
  hasScfindAtac?: boolean | null;
  trackingInfo?: EventInfo;
}

export default function ViewDatasetsDropdownButton({
  baseParams,
  hasScfindRna,
  hasScfindAtac,
  trackingInfo,
}: ViewDatasetsDropdownButtonProps) {
  const modalityCount = (hasScfindRna ? 1 : 0) + (hasScfindAtac ? 1 : 0);

  if (modalityCount <= 1) {
    const modality = hasScfindAtac && !hasScfindRna ? 'ATAC' : undefined;
    return (
      <ViewDatasetsButton
        scFindParams={{ ...baseParams, modality }}
        trackingInfo={trackingInfo}
        isLoading={false}
        endIcon
      />
    );
  }

  return <ViewDatasetsDropdown baseParams={baseParams} trackingInfo={trackingInfo} />;
}
