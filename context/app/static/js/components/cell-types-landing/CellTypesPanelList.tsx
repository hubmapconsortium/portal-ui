import React, { useMemo } from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';

import CellTypesPanel from './CellTypesPanelItem';
import { useCellTypesList } from './hooks';
import { useCellTypesSearchState } from './CellTypesSearchContext';

export default function CellTypesPanelList() {
  const { cellTypes, isLoading } = useCellTypesList();
  const { search, organs } = useCellTypesSearchState();

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!cellTypes.length) {
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
        key: 'filters',
        noHover: true,
        children: <CellTypesPanel.Filters />,
      },
      {
        key: 'header',
        noPadding: true,
        children: <CellTypesPanel.Header />,
      },
      ...cellTypes
        .filter(({ label, organs: cellTypeOrgans, clid }) => {
          const matchesSearch =
            search.length === 0 ||
            label.toLowerCase().includes(search.toLowerCase()) ||
            clid?.toLowerCase().includes(search.toLowerCase());
          const matchesOrgans = organs.length === 0 || cellTypeOrgans.some((organ) => organs.includes(organ));
          return matchesSearch && matchesOrgans;
        })
        .map(({ label, organs: cellTypeOrgans, clid }) => ({
          key: label,
          noPadding: true,
          noHover: false,
          children: (
            <CellTypesPanel.Item name={label} href={`/cell-types/${clid}`} clid={clid} organs={cellTypeOrgans} />
          ),
        })),
    ];
    return propsList;
  }, [cellTypes, isLoading, organs, search]);

  return <PanelList panelsProps={panelsProps} />;
}
