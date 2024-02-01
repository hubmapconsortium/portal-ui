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
  return Object.entries(availableTabDetails).reduce<AvailableTabDetailsWithIndex>((acc, [key, value], i) => {
    if (key in tabsToDisplay && tabsToDisplay[key]) {
      acc[key] = { ...value, index: i };
    }
    return acc;
  }, {});
}

export { filterTabsToDisplay };
