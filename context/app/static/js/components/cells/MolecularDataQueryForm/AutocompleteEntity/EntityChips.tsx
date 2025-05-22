import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CloseFilledIcon } from 'js/shared-styles/icons';
import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import { AutocompleteResult } from './types';

interface AdditionalChipProps extends ChipProps {
  option: AutocompleteResult;
  customLabel?: string;
}

function BaseChip({ option, customLabel, ...tagProps }: AdditionalChipProps) {
  return (
    <Chip
      {...tagProps}
      label={customLabel ?? option.full}
      deleteIcon={
        <SecondaryBackgroundTooltip title="Remove this selection.">
          <CloseFilledIcon />
        </SecondaryBackgroundTooltip>
      }
    />
  );
}

export function GeneChip(props: AdditionalChipProps) {
  const { option } = props;
  const gene = useGeneOntologyDetail(option.full).data;

  const customLabel = gene ? `${gene.approved_name} (${gene.approved_symbol})` : option.full;
  return <BaseChip {...props} customLabel={customLabel} />;
}
