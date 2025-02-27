import React, { useState } from 'react';
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

function TagComponent({ option, ...rest }: { option: WorkspaceUser }) {
  const { first_name, last_name } = option;

  return <Chip label={`${first_name} ${last_name}`} variant="outlined" color="primary" {...rest} />;
}

function UsersAutocomplete({
  selectedUsers,
  setSelectedUsers,
}: {
  selectedUsers: WorkspaceUser[];
  setSelectedUsers: (users: WorkspaceUser[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const { users: usersMatchingQuery } = useWorkspaceUsers(inputValue);

  const handleChange = useEventCallback((_, value: WorkspaceUser[]) => {
    setSelectedUsers(value);
    setInputValue('');
  });

  return (
    <Box>
      <MultiAutocomplete
        value={selectedUsers}
        options={usersMatchingQuery}
        multiple
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option === value}
        tagComponent={TagComponent}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        filterOptions={(x) => x}
        renderInputProps={{
          variant: 'outlined',
          label: 'Share With',
          helperText:
            'Search for recipients by first name, last name, or email address. Only users with the necessary workspace permissions will appear in the results.',
          sx: { color: 'red' },
        }}
        renderOption={UserOption}
        getOptionLabel={(option) => option.username}
        fullWidth
      />
    </Box>
  );
}

export default UsersAutocomplete;
