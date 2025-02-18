import React, { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useController } from 'react-hook-form';
import { useAutocompleteQuery } from './hooks';
import { AutocompleteQueryResponse } from './types';
import { createInitialValue } from './utils';
import { QueryType, queryTypes } from '../../queryTypes';
import { PreserveWhiteSpaceListItem } from './styles';
import { useQueryType, useMolecularDataQueryFormState } from '../hooks';

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

function AutocompleteEntity<T extends QueryType>({ targetEntity, defaultValue }: AutocompleteEntityProps<T>) {
  const [substring, setSubstring] = useState('');

  const { entityFieldName: fieldName } = useQueryType();

  const { control } = useMolecularDataQueryFormState();
  const { field } = useController({
    name: fieldName,
    control,
    defaultValue: createInitialValue(defaultValue).map((v) => v.full),
  });

  // If default value or target entity changes, reset selected options and substring to default value
  // useEffect(() => {
  //   setSubstring('');
  //   setSelectedOptions(createInitialValue(defaultValue));
  // }, [defaultValue, targetEntity]);

  const { data, isLoading } = useAutocompleteQuery({ targetEntity, substring });

  // Include currently selected options to avoid invalid value errors in console

  function handleChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    setSubstring(value);
  }

  return (
    <Autocomplete
      options={data}
      multiple
      filterSelectedOptions
      getOptionLabel={(option) => option.full}
      isOptionEqualToValue={(option, value) => option.full === value.full}
      loading={isLoading}
      renderOption={(props, option) => (
        <PreserveWhiteSpaceListItem {...props}>
          <span>{option.pre}</span>
          <b>{option.match}</b>
          <span>{option.post}</span>
        </PreserveWhiteSpaceListItem>
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const tagProps = getTagProps({ index });
          // Removing onDelete removes the delete icon
          const optionIsDefault = defaultValue && option.full === defaultValue;
          return (
            <Chip
              label={option.full}
              {...tagProps}
              onDelete={optionIsDefault ? undefined : tagProps.onDelete}
              key={option.full}
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
          onChange={handleChange}
          {...params}
          slotProps={{
            inputLabel: { shrink: true, ...InputLabelProps },
          }}
        />
      )}
      {...field}
      onChange={(_, value) => {
        if (defaultValue && !value.map((match) => match.full).includes(defaultValue)) {
          // If default value is set and not included in selected options, add it
          setSelectedOptions([...createInitialValue(defaultValue), ...value]);
          return;
        }
        setSelectedOptions(value);
      }}
    />
  );
}

export default AutocompleteEntity;
