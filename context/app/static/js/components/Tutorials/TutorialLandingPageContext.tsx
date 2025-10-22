import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { Tutorial, TutorialCategory, TUTORIALS } from './types';

interface TutorialLandingPageSearchDataContextType {
  search: string;
  filterCategory?: TutorialCategory;
  tutorials: Tutorial[];
}

interface TutorialLandingPageSearchActionsContextType {
  setSearch: (search: string) => void;
  setFilterCategory: (filterCategory?: TutorialCategory) => void;
}

const TutorialLandingPageSearchDataContext = createContext<TutorialLandingPageSearchDataContextType>(
  'TutorialLandingPageSearchDataContext',
);
const TutorialLandingPageSearchActionsContext = createContext<TutorialLandingPageSearchActionsContextType>(
  'TutorialLandingPageSearchActionsContext',
);

function matchSearchAndFilter(tutorials: Tutorial[], search: string, filterCategory: TutorialCategory | undefined) {
  return tutorials.filter(({ title, description, tags, category }) => {
    const matchesSearch =
      search === '' ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()) ||
      tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory ? category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });
}

export const TutorialLandingPageContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TutorialCategory | undefined>();

  const data = useMemo(
    () => ({
      search,
      filterCategory,
      tutorials: matchSearchAndFilter(TUTORIALS, search, filterCategory),
    }),
    [search, filterCategory],
  );
  const actions = useMemo(() => ({ setSearch, setFilterCategory }), []);

  return (
    <TutorialLandingPageSearchDataContext.Provider value={data}>
      <TutorialLandingPageSearchActionsContext.Provider value={actions}>
        {children}
      </TutorialLandingPageSearchActionsContext.Provider>
    </TutorialLandingPageSearchDataContext.Provider>
  );
};

export const useTutorialLandingPageSearchData = () => useContext(TutorialLandingPageSearchDataContext);
export const useTutorialLandingPageSearchActions = () => useContext(TutorialLandingPageSearchActionsContext);

export const useTutorialsByCategory = (category: TutorialCategory) => {
  const { tutorials } = useTutorialLandingPageSearchData();
  return tutorials.filter((tutorial) => tutorial.category === category);
};

export const useFeaturedTutorials = () => {
  const { tutorials } = useTutorialLandingPageSearchData();
  return tutorials.filter((tutorial) => tutorial.isFeatured);
};
