import React, { useMemo } from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';

import CellTypesPanel from './CellTypesPanelItem';
import { useCellTypesList } from './hooks';
import { useCellTypesSearchState } from './CellTypesSearchContext';

export default function CellTypesPanelList() {
  const { cellTypes, isLoading } = useCellTypesList();
  const { search, organs, sortState } = useCellTypesSearchState();

  const filteredCellTypes = useMemo(() => {
    return cellTypes.filter(({ label, organs: cellTypeOrgans, clid }) => {
      const matchesSearch =
        search.length === 0 ||
        label.toLowerCase().includes(search.toLowerCase()) ||
        clid?.toLowerCase().includes(search.toLowerCase());
      const matchesOrgans = organs.length === 0 || cellTypeOrgans.some((organ) => organs.includes(organ));
      return matchesSearch && matchesOrgans;
    });
  }, [cellTypes, search, organs]);

  const sortedCellTypes = useMemo(() => {
    return [...filteredCellTypes].sort((a, b) => {
      const aToCompare = sortState.columnId === 'name' ? a.label : a.clid;
      const bToCompare = sortState.columnId === 'name' ? b.label : b.clid;
      const sortMultiplier = sortState.direction === 'asc' ? 1 : -1;
      if (aToCompare < bToCompare) return -1 * sortMultiplier;
      if (aToCompare > bToCompare) return 1 * sortMultiplier;
      return 0; // Default case, no sorting applied
    });
  }, [filteredCellTypes, sortState]);

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!sortedCellTypes.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <>No results found. Try searching for a different cell type.</>,
          key: 'no-results',
        },
      ];
    }
    const propsList: PanelProps[] = [
      {
        key: 'header',
        noPadding: true,
        children: <CellTypesPanel.Header />,
      },
      ...sortedCellTypes.map(({ label, organs: cellTypeOrgans, clid }) => ({
        key: label,
        noPadding: true,
        noHover: false,
        children: <CellTypesPanel.Item name={label} href={`/cell-types/${clid}`} clid={clid} organs={cellTypeOrgans} />,
      })),
    ];
    return propsList;
  }, [sortedCellTypes, isLoading]);

  return <PanelList panelsProps={panelsProps} />;
}
