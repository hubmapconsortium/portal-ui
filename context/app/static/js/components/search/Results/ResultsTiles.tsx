import React, { useCallback } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputLabel from '@mui/material/InputLabel';
import Check from '@mui/icons-material/Check';

import { Entity } from 'js/components/types';
import EntityTile, { tileWidth } from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { capitalizeString } from 'js/helpers/functions';
import TileGrid from 'js/shared-styles/tiles/TileGrid';
import { trackEvent } from 'js/helpers/trackers';
import { StyledDownIcon } from 'js/shared-styles/dropdowns/DropdownMenuButton/style';
import { useSearch } from '../Search';
import ViewMoreResults from './ViewMoreResults';
import { useSearchStore } from '../store';
import { useGetFieldLabel } from '../fieldConfigurations';

function TilesSortSelect() {
  const sortField = useSearchStore((state) => state.sortField);
  const setSortField = useSearchStore((state) => state.setSortField);
  const sourceFields = useSearchStore((state) => state.sourceFields);
  const analyticsCategory = useSearchStore((state) => state.analyticsCategory);

  const { table: tableFields } = sourceFields;

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const selectedField = event.target.value;
      const direction = selectedField === 'last_modified_timestamp' ? 'desc' : 'asc';
      setSortField({ field: selectedField, direction });
      trackEvent({
        category: analyticsCategory,
        action: `Sort Tile View`,
        label: `${selectedField} ${direction}`,
      });
    },
    [setSortField, analyticsCategory],
  );

  const getFieldLabel = useGetFieldLabel();

  return (
    <FormControl>
      <InputLabel id="sort-select-label" sx={{ display: 'none' }}>
        Sort by
      </InputLabel>
      <Select
        value={sortField.field}
        onChange={handleChange}
        labelId="sort-select-label"
        color="primary"
        variant="outlined"
        IconComponent={StyledDownIcon}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.white.main,
          ...theme.typography.button,
          borderRadius: '3px',
          textAlign: 'center',
          height: '100%',
          '.MuiInputBase-input': {
            padding: 0,
            width: '185px',
            '.MuiListItemIcon-root': {
              display: 'none',
            },
          },
          svg: {
            color: theme.palette.white.main,
          },
        })}
      >
        {tableFields.map((field) => {
          const selected = field === sortField.field;
          return (
            <MenuItem key={field} value={field} selected={selected}>
              {selected && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              {getFieldLabel(field)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

function Tile({ hit }: { hit: SearchHit<Partial<Entity>> }) {
  if (!(hit?._source?.hubmap_id && hit?._source.uuid && hit?._source?.entity_type)) {
    return null;
  }

  return (
    <EntityTile
      key={hit?._source?.uuid}
      entity_type={hit?._source?.entity_type}
      uuid={hit?._source?.uuid}
      id={hit?._source?.hubmap_id}
      entityData={hit?._source}
      descendantCounts={getTileDescendantCounts(hit?._source, capitalizeString(hit?._source?.entity_type))}
    />
  );
}

function ResultsTiles() {
  const { searchHits: hits } = useSearch();

  return (
    <Box>
      <TileGrid $tileWidth={tileWidth}>
        {hits.map((hit) => (
          <Tile hit={hit} key={hit?._id} />
        ))}
      </TileGrid>
      <ViewMoreResults />
    </Box>
  );
}

export { TilesSortSelect };
export default ResultsTiles;
