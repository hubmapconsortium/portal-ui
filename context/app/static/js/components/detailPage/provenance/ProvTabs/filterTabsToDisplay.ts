interface TabDetails {
  label: string;
  'data-testid': string;
}

type AvailableTabDetails = Record<string, TabDetails>;
type TabsToDisplay = Record<string, boolean>;

interface GetTabsToDisplayTypes {
  availableTabDetails: AvailableTabDetails;
  tabsToDisplay: TabsToDisplay;
}

type AvailableTabDetailsWithIndex = Record<string, TabDetails & { index: number }>;

function filterTabsToDisplay({ availableTabDetails, tabsToDisplay }: GetTabsToDisplayTypes) {
  const tabs = Object.entries(availableTabDetails).reduce<{
    tabs: AvailableTabDetailsWithIndex | Record<string, never>;
    currentIndex: number;
  }>(
    (acc, [key, value]) => {
      if (key in tabsToDisplay && tabsToDisplay[key]) {
        const tabsCopy = { ...acc.tabs, [key]: { ...value, index: acc.currentIndex } };
        return { tabs: tabsCopy, currentIndex: acc.currentIndex + 1 };
      }
      return acc;
    },
    { tabs: {}, currentIndex: 0 },
  );
  return tabs.tabs;
}

export { filterTabsToDisplay };
