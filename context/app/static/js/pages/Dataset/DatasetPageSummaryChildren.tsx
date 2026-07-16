import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { InternalLink } from 'js/shared-styles/Links';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { Sample } from 'js/components/types';

interface SummaryDataChildrenProps {
  mapped_data_types: string[];
  origin_samples: Sample[];
}

// Number of organs shown inline before the rest collapse into a "N more..." chip.
const MAX_VISIBLE_ORGANS = 2;

function OrganLinkContent({ organ }: { organ: string }) {
  // SummaryItem wraps its content in a <p>; keep everything inline so the HTML stays valid.
  return (
    <Stack
      component="span"
      direction="row"
      spacing={0.5}
      alignItems="center"
      display="inline-flex"
      // A center-aligned inline-flex box synthesizes its baseline at its bottom edge, so it rides
      // above the adjacent plain-text links; middle-align it against the surrounding text instead.
      sx={{ verticalAlign: 'middle' }}
    >
      <OrganIcon component="span" organName={organ} />
      <Typography component="span" fontSize="inherit">
        {organ}
      </Typography>
    </Stack>
  );
}

export default function SummaryDataChildren({ mapped_data_types, origin_samples }: SummaryDataChildrenProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const dataTypes = mapped_data_types.join(', ');
  const mapped_organs = [...new Set(origin_samples.flatMap((s) => s.mapped_organ))];

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const visibleOrgans = mapped_organs.slice(0, MAX_VISIBLE_ORGANS);
  const hiddenOrgans = mapped_organs.slice(MAX_VISIBLE_ORGANS);

  return (
    <>
      <SummaryItem>
        <InternalLink
          href="https://docs.hubmapconsortium.org/assays/metadata"
          underline="none"
          onClick={() => {
            trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: dataTypes });
          }}
        >
          {dataTypes}
        </InternalLink>
      </SummaryItem>
      {visibleOrgans.map((mapped_organ, idx) => (
        <SummaryItem showDivider={hiddenOrgans.length > 0 || idx !== visibleOrgans.length - 1} key={mapped_organ}>
          <InternalLink href={`/organs/${mapped_organ}`} underline="none">
            <OrganLinkContent organ={mapped_organ} />
          </InternalLink>
        </SummaryItem>
      ))}
      {hiddenOrgans.length > 0 && (
        <SummaryItem showDivider={false}>
          <Chip
            clickable
            variant="outlined"
            color="primary"
            size="small"
            label={`${hiddenOrgans.length} more...`}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchorEl)}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          />
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {hiddenOrgans.map((mapped_organ) => (
              <MenuItem
                key={mapped_organ}
                component={InternalLink}
                href={`/organs/${mapped_organ}`}
                underline="none"
                onClick={() => setAnchorEl(null)}
              >
                <OrganLinkContent organ={mapped_organ} />
              </MenuItem>
            ))}
          </Menu>
        </SummaryItem>
      )}
    </>
  );
}
