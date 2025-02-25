import React, { SyntheticEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WorkspaceUser } from 'js/components/workspaces/types';
import { Chip, useEventCallback } from '@mui/material';
import { useWorkspaceUsers } from 'js/components/workspaces/api';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';

function UserOption(props: React.HTMLAttributes<HTMLLIElement>, option: WorkspaceUser) {
  const { id, first_name, last_name, email } = option;

  return (
    <li {...props} key={id}>
      <div>
        <Typography variant="subtitle1">{`${first_name} ${last_name}`}</Typography>
        <Typography variant="body2">{email}</Typography>
      </div>
    </li>
  );
}

export interface TagTypes {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

function UsersAutocomplete({
  selectedUsers,
  setSelectedUsers,
}: {
  selectedUsers: WorkspaceUser[];
  setSelectedUsers: (users: WorkspaceUser[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  // const [autocompleteValue, setAutocompleteValue] = useState<WorkspaceUser[] | undefined>(undefined);
  const { users: usersMatchingQuery } = useWorkspaceUsers(inputValue);

  const resetAutocompleteState = useEventCallback(() => {
    setInputValue('');
    // setAutocompleteValue(undefined);
  });

  const handleChange = useEventCallback((e: SyntheticEvent<Element, Event>, newValue: WorkspaceUser[] | undefined) => {
    if (newValue?.at(0)?.id) {
      setSelectedUsers([...selectedUsers, ...newValue]);
      resetAutocompleteState();
    }
  });

  return (
    <Box flex={1} maxWidth="50%">
      <MultiAutocomplete
        value={selectedUsers}
        options={usersMatchingQuery}
        multiple
        filterSelectedOptions
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        filterOptions={(x) => x}
        renderInputProps={{
          variant: 'outlined',
          label: 'Share With',
          placeholder: 'Search here',
        }}
        renderOption={UserOption}
        tagComponent={TagComponent}
        getOptionLabel={(option) => option.username}
        fullWidth
      />
    </Box>
  );
}

export default UsersAutocomplete;
