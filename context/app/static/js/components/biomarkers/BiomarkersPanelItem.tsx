import React, { useState } from 'react';

import Chip from '@mui/material/Chip';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMobile } from 'js/hooks/media-queries';
import { BodyCell, HeaderCell, StackTemplate } from 'js/shared-styles/panels/ResponsivePanelCells';
import Box from '@mui/material/Box';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { ExpandableDescription } from 'js/shared-styles/text';
import { trackEvent } from 'js/helpers/trackers';
import { getSearchURL } from '../organ/utils';

// Uniform, compact width for the Data Type chips so the modalities line up across rows.
const CHIP_WIDTH = '6.5rem';

const dataTypeTooltip =
  'Indicates which data types this gene was detected in: RNAseq (gene expression) or ATACseq ' +
  '(chromatin accessibility). The count is how many scFind-indexed datasets contain the gene for that data type.';

const desktopConfig = {
  name: {
    flexBasis: '25%',
    flexGrow: 1,
    flexShrink: 0,
  },
  description: {
    flexBasis: '45%',
    flexGrow: 1,
    flexShrink: 1,
  },
  dataType: {
    flexBasis: '14rem',
    flexShrink: 0,
    flexGrow: 0,
    pr: 2,
  },
};

function BiomarkerHeaderPanel() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }
  // Match the body rows' default StackTemplate spacing (4) so the header labels line up with the
  // left edge of each column's content.
  return (
    <StackTemplate spacing={4}>
      <HeaderCell {...desktopConfig.name}>Name</HeaderCell>
      <HeaderCell {...desktopConfig.description}>Description</HeaderCell>
      <HeaderCell {...desktopConfig.dataType}>
        <InfoTextTooltip infoIconSize="small" tooltipTitle={dataTypeTooltip}>
          Data Type
        </InfoTextTooltip>
      </HeaderCell>
    </StackTemplate>
  );
}

interface BiomarkerPanelItemProps {
  name: string;
  href?: string;
  description?: string;
  geneName: string;
  rnaDatasetCount: number;
  atacDatasetCount: number;
}

/**
 * Outlined, clickable chips — one per data type the gene was detected in — each linking to that
 * modality's datasets and labelled with the dataset count (mirrors the Cell Types landing page).
 */
function DataTypeChips({
  geneName,
  name,
  rnaDatasetCount,
  atacDatasetCount,
}: Pick<BiomarkerPanelItemProps, 'geneName' | 'name' | 'rnaDatasetCount' | 'atacDatasetCount'>) {
  const trackClick = (modality: string) =>
    trackEvent({
      category: 'Biomarker Landing Page',
      action: `View Datasets / ${modality}`,
      label: name,
    });

  // Two fixed-width slots (RNAseq, then ATACseq). The grid pins each modality to its own column so
  // chips line up across every row — a row missing a modality leaves that slot empty rather than
  // letting the remaining chip slide into the other column's position.
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(2, ${CHIP_WIDTH})`, gap: 1, width: 'max-content' }}>
      {rnaDatasetCount > 0 ? (
        <Chip
          size="small"
          sx={{ width: '100%', borderRadius: '8px' }}
          variant="outlined"
          clickable
          component="a"
          href={getSearchURL({ entityType: 'Dataset', scFindParams: { genes: [geneName] } })}
          label={`RNAseq (${rnaDatasetCount})`}
          onClick={() => trackClick('RNAseq')}
        />
      ) : (
        <Box aria-hidden />
      )}
      {atacDatasetCount > 0 ? (
        <Chip
          size="small"
          sx={{ width: '100%', borderRadius: '8px' }}
          variant="outlined"
          clickable
          component="a"
          href={getSearchURL({ entityType: 'Dataset', scFindParams: { genes: [geneName], modality: 'ATAC' } })}
          label={`ATACseq (${atacDatasetCount})`}
          onClick={() => trackClick('ATACseq')}
        />
      ) : (
        <Box aria-hidden />
      )}
    </Box>
  );
}

function BiomarkerPanelItem({
  name,
  href,
  description,
  geneName,
  rnaDatasetCount,
  atacDatasetCount,
}: BiomarkerPanelItemProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  return (
    // Rows are a fixed height by default; when the description is expanded, let the row grow to fit.
    <StackTemplate {...(descriptionExpanded ? { height: 'auto', minHeight: 52, alignItems: 'flex-start' } : {})}>
      <BodyCell {...desktopConfig.name} aria-label="Name">
        <Box>
          <InternalLink href={href}>{name}</InternalLink>
        </Box>
      </BodyCell>
      <BodyCell {...desktopConfig.description} aria-label="Description">
        <ExpandableDescription
          description={description}
          expanded={descriptionExpanded}
          onToggle={() => setDescriptionExpanded((prev) => !prev)}
        />
      </BodyCell>
      <BodyCell {...desktopConfig.dataType} aria-label="Data Type">
        <DataTypeChips
          geneName={geneName}
          name={name}
          rnaDatasetCount={rnaDatasetCount}
          atacDatasetCount={atacDatasetCount}
        />
      </BodyCell>
    </StackTemplate>
  );
}

const BiomarkerPanel = {
  Header: BiomarkerHeaderPanel,
  Item: BiomarkerPanelItem,
};

export default BiomarkerPanel;
