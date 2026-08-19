import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { debounce } from '@mui/material/utils';

import { trackEvent } from 'js/helpers/trackers';
import { useSearchStore } from '../../store';

const DEBOUNCE_MS = 300;

const HELP_TEXT =
  'Matches anywhere in a file’s path, so "expr" finds expr.h5ad and raw_expr.h5ad, and a folder name matches everything inside it.';

/**
 * "Contains" filter over the file path.
 *
 * Separate from the free-text box because the two ask different questions, and because free text
 * cannot do this: the analyzed path field tokenizes into whole path segments, so searching
 * "secondary" there finds nothing even though `secondary_analysis.h5ad` exists. Free text also
 * routes a `*...*` term to the dataset ID field, not the path.
 */
function FilenameFilterBar() {
  const filenameFilter = useSearchStore((state) => state.filenameFilter);
  const setFilenameFilter = useSearchStore((state) => state.setFilenameFilter);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const [inputValue, setInputValue] = useState(filenameFilter ?? '');
  // Mirrors TopSearchBar: lets the input resync when the store changes from elsewhere (a filter
  // chip being cleared, "reset filters") without fighting the user's typing.
  const lastSeenStoreValue = useRef(filenameFilter ?? '');

  useEffect(() => {
    const storeValue = filenameFilter ?? '';
    if (storeValue !== lastSeenStoreValue.current) {
      lastSeenStoreValue.current = storeValue;
      setInputValue(storeValue);
    }
  }, [filenameFilter]);

  const commit = useMemo(
    () =>
      debounce((value: string) => {
        setFilenameFilter(value);
        if (value) {
          trackEvent({ category: analyticsCategory, action: 'Filter by File Name', label: value });
        }
      }, DEBOUNCE_MS),
    [setFilenameFilter, analyticsCategory],
  );

  useEffect(() => () => commit.clear(), [commit]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
      // Recorded here rather than in the debounced callback, so the effect above can tell an
      // external store change from the one this input is about to make.
      lastSeenStoreValue.current = value;
      commit(value);
    },
    [commit],
  );

  return (
    <TextField
      fullWidth
      size="small"
      value={inputValue}
      onChange={handleChange}
      placeholder="Filter by file or folder name"
      slotProps={{
        // On the actual input element, not the wrapper: a top-level `aria-label` on TextField lands
        // on the root div, where it labels something that cannot be typed into.
        htmlInput: { 'aria-label': 'Filter by file or folder name' },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <FolderOpenRoundedIcon color="primary" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={HELP_TEXT}>
                <IconButton size="small" aria-label="About file name filtering" tabIndex={-1}>
                  <InfoOutlinedIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default FilenameFilterBar;
