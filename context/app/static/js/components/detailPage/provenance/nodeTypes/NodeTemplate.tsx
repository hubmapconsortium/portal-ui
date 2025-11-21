import React, { PropsWithChildren } from 'react';
import { Handle, Position } from '@xyflow/react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { SvgIconComponent } from '@mui/icons-material';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { styled } from '@mui/material/styles';

const AsteriskWrapper = styled('span')({
  color: 'red',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginLeft: '0.25rem',
});

interface NodeTemplateProps extends PropsWithChildren {
  displayName: string;
  icon?: SvgIconComponent;
  target?: boolean;
  source?: boolean;
  rounded?: boolean;
  bgColor?: string;
  showAsterisk?: boolean;
  tooltipText?: string;
}

const nodeHeightRem = 4.375;

/**
 * Template component for provenance graph nodes
 * Adapted from DatasetRelationships NodeTemplate with provenance-specific styling
 */
export function NodeTemplate({
  icon: Icon,
  children,
  displayName,
  target,
  source,
  rounded,
  bgColor,
  showAsterisk,
  tooltipText,
}: NodeTemplateProps) {
  const contents = (
    <Box height={`${nodeHeightRem}rem`} display="flex" alignItems="center">
      <Stack
        direction="column"
        px={2}
        py={1}
        borderRadius={rounded ? '1rem' : 0}
        minWidth="15rem"
        maxWidth="20rem"
        bgcolor={bgColor}
        boxShadow="0px 0px 2px 0px rgba(0, 0, 0, 0.14), 0px 2px 2px 0px rgba(0, 0, 0, 0.12), 0px 1px 3px 0px rgba(0, 0, 0, 0.20)"
      >
        <Stack direction="row" gap={1} my="auto" alignItems="center">
          {Icon && <Icon color="primary" fontSize="1.5rem" width="1.5rem" height="1.5rem" />}
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          {showAsterisk && <AsteriskWrapper aria-label="Current entity">*</AsteriskWrapper>}
        </Stack>
        {children && <Typography variant="body2">{children}</Typography>}
        {target && <Handle style={{ opacity: 0 }} type="target" position={Position.Left} />}
        {source && <Handle style={{ opacity: 0 }} type="source" position={Position.Right} />}
      </Stack>
    </Box>
  );

  if (tooltipText) {
    return (
      <SecondaryBackgroundTooltip title={tooltipText} placement="top">
        {contents}
      </SecondaryBackgroundTooltip>
    );
  }

  return contents;
}
