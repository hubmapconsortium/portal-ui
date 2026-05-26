import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useShallow } from 'zustand/react/shallow';
import { debounce } from '@mui/material/utils';

import { trackEvent } from 'js/helpers/trackers';
import { useSearchStore } from '../store';

const DEBOUNCE_MS = 300;

function TopSearchBar() {
  const { search, setSearch, analyticsCategory } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
      setSearch: state.setSearch,
      analyticsCategory: state.analyticsCategory,
    })),
  );

  const [inputValue, setInputValue] = useState(search);

  // Keep local input in sync when the store value changes externally (e.g. filter chip reset).
  const lastSeenStoreValue = useRef(search);
  useEffect(() => {
    if (search !== lastSeenStoreValue.current) {
      lastSeenStoreValue.current = search;
      setInputValue(search);
    }
  }, [search]);

  const commit = useMemo(
    () =>
      // The ref `lastSeenStoreValue` is captured by this debounced callback;
      // react-hooks/refs flags it as a render-time read because the closure
      // is created during render, but the actual access only happens once
      // the debounced fn fires from a user event.
      // eslint-disable-next-line react-hooks/refs
      debounce((value: string) => {
        setSearch(value);
        lastSeenStoreValue.current = value;
        trackEvent({
          category: analyticsCategory,
          action: 'Search',
          label: value,
        });
      }, DEBOUNCE_MS),
    [setSearch, analyticsCategory],
  );

  useEffect(() => {
    return () => {
      commit.clear();
    };
  }, [commit]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInputValue(next);
      commit(next);
    },
    [commit],
  );

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Search"
      value={inputValue}
      onChange={handleChange}
      aria-label="Freetext search"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default TopSearchBar;
