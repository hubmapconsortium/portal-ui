import React, { ForwardedRef, forwardRef, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useController, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import { useCellTypeOrgansColorMap } from 'js/api/scfind/useCellTypeNames';
import { useEventCallback } from '@mui/material/utils';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { CloseFilledIcon, CloseIcon } from 'js/shared-styles/icons';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useAutocompleteQuery } from './hooks';
import { AutocompleteResult } from './types';
import { createInitialValue } from './utils';
import { QueryType, queryTypes } from '../../queryTypes';
import { PreserveWhiteSpaceListItem } from './styles';
import { useQueryType, useMolecularDataQueryFormState } from '../hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryFormTrackingProvider';
import { CustomChip } from './EntityChips';

function buildHelperText(entity: string): string {
  return `Multiple ${entity} are allowed and only 'OR' queries are supported.`;
}

const labelAndHelperTextProps: Record<QueryType, Pick<TextFieldProps, 'label' | 'helperText'>> = {
  gene: { label: 'Gene Symbol', helperText: buildHelperText('gene symbols') },
  protein: { label: 'Protein', helperText: buildHelperText('proteins') },
  'cell-type': { label: 'Cell Type', helperText: buildHelperText('cell types') },
};
interface AutocompleteEntityProps<T extends QueryType> {
  targetEntity: T;
  defaultValue?: string;
}

// Custom wrapper for the clear indicator to add a tooltip
const ClearIndicator = forwardRef(function ClearIndicator(
  props: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <SecondaryBackgroundTooltip title="Clear all selections.">
      <IconButton {...props} ref={ref} title={undefined}>
        <CloseIcon />
      </IconButton>
    </SecondaryBackgroundTooltip>
  );
});

function LimitCount() {
  const { entityFieldName: fieldName, label } = useQueryType();
  const { getValues } = useMolecularDataQueryFormState();

  const selectedValues = getValues(fieldName).map((value: AutocompleteResult) => value.full);

  return function LimitCountInner(count: number) {
    return (
      <SecondaryBackgroundTooltip title={`Selected ${label.toLowerCase()}s: ${selectedValues.join(', ')}`}>
        <span>{`+${count}`}</span>
      </SecondaryBackgroundTooltip>
    );
  };
}

function AutocompleteEntity<T extends QueryType>({ targetEntity, defaultValue }: AutocompleteEntityProps<T>) {
  const [substring, setSubstring] = useState('');

  const { entityFieldName: fieldName } = useQueryType();
  const { track } = useMolecularDataQueryFormTracking();

  const { control } = useMolecularDataQueryFormState();
  const { field } = useController({
    name: fieldName,
    control,
    defaultValue: createInitialValue(defaultValue),
  });

  const queryMethod = useWatch({ control, name: 'queryMethod' });

  const { data: options = [], isLoading } = useAutocompleteQuery({ targetEntity, substring, queryMethod });

  const chipColors = useCellTypeOrgansColorMap();

  const handleSubstringChange = useEventCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSubstring(value);
  });

  const onChange = useEventCallback((_event: React.SyntheticEvent, value: AutocompleteResult[]) => {
    // Handle selection of multi-value options by pulling out the values and formatting them to match the expected structure
    const formattedValue = value.reduce((acc, curr) => {
      if (curr.values) {
        const values = curr.values.map((v) => ({
          full: v,
          pre: curr.pre,
          match: curr.match,
          post: curr.post,
          tags: curr.tags,
        }));
        return [...acc, ...values];
      }
      return [...acc, curr];
    }, [] as AutocompleteResult[]);

    track(
      `Parameters / Select ${labelAndHelperTextProps[targetEntity].label as string}`,
      formattedValue.map((f) => f.full).join(', '),
    );

    field.onChange(formattedValue);
  });

  const limitTags = targetEntity === 'gene' ? 3 : 5;

  return (
    <Autocomplete
      options={options}
      multiple
      filterSelectedOptions
      getOptionLabel={(option) => option.full}
      isOptionEqualToValue={(option, value) =>
        Boolean(option.full === value.full || option.values?.some((v) => v === value.full))
      }
      loading={isLoading}
      renderOption={(props, option) => (
        <PreserveWhiteSpaceListItem {...props} key={option.full}>
          <span>{option.pre}</span>
          <b>{option.match}</b>
          <span>{option.post}</span>
          {option?.tags && (
            <Box sx={{ display: 'flex', ml: 'auto', gap: 1 }}>
              {option?.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="filled"
                  sx={{ ml: 'auto', background: chipColors(tag) }}
                />
              ))}
            </Box>
          )}
        </PreserveWhiteSpaceListItem>
      )}
      slotProps={{
        clearIndicator: {
          component: ClearIndicator,
        },
      }}
      limitTags={limitTags}
      getLimitTagsText={LimitCount()}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const tagProps = getTagProps({ index });
          // Removing onDelete removes the delete icon
          const optionIsDefault = defaultValue && option.full === defaultValue;
          const onDelete = optionIsDefault ? undefined : tagProps.onDelete;
          return (
            <CustomChip
              targetEntity={targetEntity}
              option={option}
              {...tagProps}
              onDelete={onDelete}
              key={option.full}
              deleteIcon={
                <SecondaryBackgroundTooltip title="Remove this selection.">
                  <CloseFilledIcon />
                </SecondaryBackgroundTooltip>
              }
            />
          );
        })
      }
      renderInput={({ InputLabelProps, ...params }) => (
        <TextField
          {...labelAndHelperTextProps[targetEntity]}
          placeholder={`Select ${queryTypes[targetEntity].label.toLowerCase()} to query`}
          value={substring}
          name="substring"
          variant="outlined"
          onChange={handleSubstringChange}
          {...params}
          slotProps={{
            inputLabel: { shrink: true, ...InputLabelProps },
          }}
        />
      )}
      {...field}
      onChange={onChange}
    />
  );
}

export default AutocompleteEntity;
