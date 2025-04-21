import React from 'react';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import useEventCallback from '@mui/material/utils/useEventCallback';

import { StyledSearchIcon, StyledTextField } from 'js/components/workspaces/style';
import { WorkspaceWithUserId } from 'js/components/workspaces/types';
import { trackEvent } from 'js/helpers/trackers';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';

function WorkspaceOption(props: React.HTMLAttributes<HTMLLIElement>, option: WorkspaceWithUserId) {
  const { name, id } = option;

  return (
    <li {...props} key={id}>
      <div>
        <Typography variant="subtitle1">{name}</Typography>
        <Typography variant="body2">{`ID: ${id}`}</Typography>
      </div>
    </li>
  );
}

function WorkspaceSearchField(params: AutocompleteRenderInputParams) {
  const { InputProps } = params;
  return (
    <StyledTextField
      {...params}
      fullWidth
      size="small"
      placeholder="Search workspace by name or ID"
      slotProps={{
        input: {
          ...InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

function WorkspacesAutocomplete({
  inputValue,
  setInputValue,
  filteredWorkspaces,
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  filteredWorkspaces: WorkspaceWithUserId[];
}) {
  const { currentEventCategory } = useWorkspacesEventContext();
  const trackChange = useEventCallback((event: React.SyntheticEvent, newValue: string | WorkspaceWithUserId | null) => {
    if (newValue && typeof newValue !== 'string') {
      trackEvent({
        category: currentEventCategory,
        action: 'Search Workspace',
        label: newValue.id,
      });
    }
  });

  return (
    <Box flex={1} maxWidth="50%">
      <Autocomplete
        value=""
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={trackChange}
        filterOptions={(x) => x}
        options={filteredWorkspaces}
        renderOption={WorkspaceOption}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        freeSolo
        fullWidth
        renderInput={WorkspaceSearchField}
      />
    </Box>
  );
}

export default WorkspacesAutocomplete;
