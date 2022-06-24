// Copied from https://github.com/searchkit/searchkit/blob/next/packages/searchkit-client/src/withSearchkitRouting.tsx
// Modified to set default page Size,

export const routeToStateWithDefaultPageSize = (defaultPageSize) => (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort || '',
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || defaultPageSize,
    from: Number(routeState.from) || 0,
  },
});
