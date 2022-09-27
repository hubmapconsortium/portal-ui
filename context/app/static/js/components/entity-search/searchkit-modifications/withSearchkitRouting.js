/* eslint-disable radix */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import isEqual from 'fast-deep-equal';
import qs from 'qs';
import {
  useSearchkitVariables,
  useSearchkit,
  searchStateEqual,
  SearchkitRoutingOptionsContext,
} from '@searchkit/client';
import history, { defaultParseURL, defaultCreateURL } from '@searchkit/client/lib/cjs/history';

const sanitiseRouteState = (routeState) => {
  const intKeys = ['size', 'from'];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of intKeys) {
    if (routeState[key] !== undefined && typeof routeState[key] === 'string') {
      // eslint-disable-next-line no-param-reassign
      routeState[key] = parseInt(routeState[key]);
    }
  }
  return routeState;
};

export const routeStateEqual = (a, b) => isEqual(sanitiseRouteState(a), sanitiseRouteState(b));

export const stateToRouteFn = (searchState) => {
  const routeState = {
    query: searchState.query,
    sort: searchState.sortBy,
    filters: searchState.filters,
    size: parseInt(searchState.page?.size),
    from: parseInt(searchState.page?.from),
  };
  return Object.keys(routeState).reduce((sum, key) => {
    if (
      (Array.isArray(routeState[key]) && routeState[key].length > 0) ||
      (!Array.isArray(routeState[key]) && !!routeState[key])
    ) {
      // eslint-disable-next-line no-param-reassign
      sum[key] = routeState[key];
    }
    return sum;
  }, {});
};

export const routeToStateFn = (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort || '',
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || 10,
    from: Number(routeState.from) || 0,
  },
});

export default function withSearchkitRouting(
  Page,
  {
    stateToRoute = stateToRouteFn,
    routeToState = routeToStateFn,
    createURL = defaultCreateURL,
    parseURL = defaultParseURL,
    router = null,
  } = {},
) {
  let routingInstance = router;

  const getRouting = () => {
    if (routingInstance) return routingInstance;
    if (typeof window === 'undefined') {
      return null;
    }
    routingInstance = history({ createURL, parseURL });

    return routingInstance;
  };

  const routingOptions = {
    stateToRoute,
    routeToState,
    createURL: (config) => createURL({ ...config, qsModule: qs }),
    parseURL: (config) => parseURL({ ...config, qsModule: qs }),
  };

  // eslint-disable-next-line no-shadow
  const withSearchkitRouting = (props) => {
    const searchkitVariables = useSearchkitVariables();
    const api = useSearchkit();

    useEffect(() => {
      // eslint-disable-next-line no-shadow
      const router = getRouting();
      if (router) {
        const routeState = stateToRoute(searchkitVariables);
        const currentRouteState = {
          size: api.baseSearchState.page?.size,
          ...router.read(),
        };
        if (!routeStateEqual(currentRouteState, routeState)) {
          router.write(routeState, true);
        }
      }
    }, [api.baseSearchState.page, searchkitVariables]);

    useEffect(() => {
      // eslint-disable-next-line no-shadow
      const router = getRouting();
      const routeToSearchFn = (routeState) => {
        const searchState = routeToState(routeState);
        if (!searchStateEqual(searchState, api.searchState)) {
          api.setSearchState(searchState);
          api.search();
        }
      };
      if (router) {
        router.onUpdate(routeToSearchFn);
      }
      const routeState = router.read();
      const searchState = routeToState(routeState);
      api.setSearchState(searchState);
      api.search();

      return function cleanup() {
        router.dispose();
      };
    }, [api]);

    return (
      <SearchkitRoutingOptionsContext.Provider value={routingOptions}>
        <Page {...props} />
      </SearchkitRoutingOptionsContext.Provider>
    );
  };

  withSearchkitRouting.getInitialProps = async (pageCtx) => {
    let props;
    const ctx = 'Component' in pageCtx ? pageCtx.ctx : pageCtx;
    const { searchkitClient } = pageCtx;

    if (Page.getInitialProps) {
      props = await Page.getInitialProps(ctx);
    }

    const mockLocation = {
      hostname: ctx.req?.headers.host,
      href: ctx.asPath,
      pathname: ctx.pathname,
      search: ctx.asPath.substring(ctx.pathname.length),
    };

    const searchState = routeToState(routingOptions.parseURL({ location: mockLocation }));
    searchkitClient.updateBaseSearchState(searchState);

    return {
      ...props,
      searchState,
    };
  };

  return withSearchkitRouting;
}
