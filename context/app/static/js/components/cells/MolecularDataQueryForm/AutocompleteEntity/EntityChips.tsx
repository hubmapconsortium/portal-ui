import React, { useMemo } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CloseFilledIcon } from 'js/shared-styles/icons';
import { useGeneOntologyDetail } from 'js/hooks/useUBKG';
import { AutocompleteResult } from './types';
import { QueryType } from '../types';

interface InternalChipProps extends ChipProps {
  option: AutocompleteResult;
}

function BaseChip({ option, ...tagProps }: InternalChipProps) {
  return (
    <Chip
      {...tagProps}
      deleteIcon={
        <SecondaryBackgroundTooltip title="Remove this selection.">
          <CloseFilledIcon />
        </SecondaryBackgroundTooltip>
      }
    />
  );
}

function GeneChip(props: InternalChipProps) {
  const { option } = props;
  const gene = useGeneOntologyDetail(option.full).data;

  const label = useMemo(() => {
    if (gene) {
      return `${gene.approved_name} (${gene.approved_symbol})`;
    }
    return option.full;
  }, [gene, option]);

  return <BaseChip {...props} label={label} />;
}

interface CustomChipProps extends InternalChipProps {
  targetEntity: QueryType;
}

export function CustomChip({ targetEntity, ...props }: CustomChipProps) {
  switch (targetEntity) {
    case 'gene':
      return <GeneChip {...props} />;
    // Add other cases for different entities when needed, e.g. protein, cell-type, etc.
    default:
      return <BaseChip {...props} />;
  }
}
