import React, { useMemo } from 'react';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';

import OrgansPanel from './OrgansPanelItem';
import { OrganFileWithDescendants } from './types';
import { useOrgansSearchState } from './OrgansSearchContext';

interface OrgansPanelListProps {
  organs: Record<string, OrganFileWithDescendants>;
  isLoading?: boolean;
}

export default function OrgansPanelList({ organs, isLoading = false }: OrgansPanelListProps) {
  const { search, sortState } = useOrgansSearchState();

  const organsList = useMemo(() => Object.values(organs), [organs]);

  const filteredOrgans = useMemo(() => {
    return organsList.filter(({ name, uberon_short }) => {
      const matchesSearch =
        search.length === 0 ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        uberon_short.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [organsList, search]);

  const sortedOrgans = useMemo(() => {
    return [...filteredOrgans].sort((a, b) => {
      let aToCompare: string | number;
      let bToCompare: string | number;

      switch (sortState.columnId) {
        case 'name':
          aToCompare = a.name;
          bToCompare = b.name;
          break;
        case 'description':
          aToCompare = a.description;
          bToCompare = b.description;
          break;
        case 'datasets':
          aToCompare = a.descendantCounts.Dataset || 0;
          bToCompare = b.descendantCounts.Dataset || 0;
          break;
        case 'samples':
          aToCompare = a.descendantCounts.Sample || 0;
          bToCompare = b.descendantCounts.Sample || 0;
          break;
        default:
          aToCompare = a.name;
          bToCompare = b.name;
      }

      const sortMultiplier = sortState.direction === 'asc' ? 1 : -1;

      if (typeof aToCompare === 'string' && typeof bToCompare === 'string') {
        return aToCompare.localeCompare(bToCompare) * sortMultiplier;
      }

      if (aToCompare < bToCompare) return -1 * sortMultiplier;
      if (aToCompare > bToCompare) return 1 * sortMultiplier;
      return 0;
    });
  }, [filteredOrgans, sortState]);

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!sortedOrgans.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <>No results found. Try searching for a different organ name or UBERON ID.</>,
          key: 'no-results',
        },
      ];
    }

    const propsList: PanelProps[] = [
      {
        key: 'header',
        noPadding: true,
        children: <OrgansPanel.Header />,
      },
      ...sortedOrgans.map((organ) => ({
        key: organ.name,
        noPadding: true,
        noHover: false,
        children: <OrgansPanel.Item organ={organ} href={`/organs/${encodeURIComponent(organ.name.toLowerCase())}`} />,
      })),
    ];
    return propsList;
  }, [sortedOrgans, isLoading]);

  return <PanelList panelsProps={panelsProps} />;
}
