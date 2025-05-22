import React, { useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';

import { useController } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useEventCallback } from '@mui/material/utils';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useMolecularDataQueryFormState } from '../hooks';
import { usePathwayAutocompleteQuery, useSelectedPathwayParticipants } from './hooks';
import { PreserveWhiteSpaceListItem } from './styles';
import { AutocompleteResult } from './types';

export default function GenePathwaysAutocomplete() {
  const [substring, setSubstring] = useState('');
  const { control } = useMolecularDataQueryFormState();
  const { field } = useController({
    name: 'pathway',
    control,
    defaultValue: null,
  });

  useSelectedPathwayParticipants();

  const handleSubstringChange = useEventCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSubstring(value);
  });

  const handlePathwayChange = useEventCallback((_: React.SyntheticEvent, value: AutocompleteResult | null) => {
    field.onChange(value);
  });

  const { options, isLoading } = usePathwayAutocompleteQuery(substring);

  return (
    <Autocomplete
      title="pathway"
      loading={isLoading}
      getOptionLabel={(option) => `${option.full}`}
      renderOption={(props, option: AutocompleteResult) => (
        <PreserveWhiteSpaceListItem {...props} key={option.full}>
          <span>{option.pre}</span>
          <b>{option.match}</b>
          <span>{option.post}</span>
          {'tags' in option && option?.tags && (
            <Box sx={{ display: 'flex', ml: 'auto', gap: 1 }}>
              {option.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="filled" />
              ))}
            </Box>
          )}
        </PreserveWhiteSpaceListItem>
      )}
      renderInput={({ InputLabelProps, ...params }) => (
        <TextField
          placeholder="Find a pathway by name (e.g. DNA Damage)."
          value={substring}
          label="Pathways (Optional)"
          helperText={
            <>
              Selecting a pathway will automatically populate the gene selection. Only one pathway can be selected. This
              list of gene pathways is sourced from{' '}
              <OutboundIconLink href="https://reactome.org/">Reactome</OutboundIconLink>.
            </>
          }
          variant="outlined"
          onChange={handleSubstringChange}
          {...params}
          slotProps={{
            inputLabel: { shrink: true, ...InputLabelProps },
          }}
        />
      )}
      {...field}
      onChange={handlePathwayChange}
      options={options}
    />
  );
}
