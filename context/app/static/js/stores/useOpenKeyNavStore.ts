import { createStore } from 'zustand';

import { createStoreContext } from 'js/helpers/zustand';

interface OpenKeyNavStoreState {
  initialize: boolean;
}

interface OpenKeyNavStoreActions {
  setInitialize: (b: boolean) => void;
}

export type OpenKeyNavStore = OpenKeyNavStoreState & OpenKeyNavStoreActions;

export const createOpenKeyNavStore = ({ initialize }: { initialize: boolean }) =>
  createStore<OpenKeyNavStore>((set) => ({
    initialize,
    setInitialize: (val) => {
      set({ initialize: val });
    },
  }));

const [OpenKeyNavStoreProvider, useOpenKeyNavStore, OpenKeyNavStoreContext] = createStoreContext(
  createOpenKeyNavStore,
  'Open Key Nav',
);

const OPEN_KEY_NAV_COOKIE_KEY = 'openKeyNav_enabled';

function readOpenKeyNavCookie() {
  const allCookies = document.cookie;
  const oknCookie = allCookies.split('; ').find((cookie) => cookie.startsWith(OPEN_KEY_NAV_COOKIE_KEY));

  return Boolean(oknCookie);
}

function deleteOpenKeyNavCookie() {
  document.cookie = `${OPEN_KEY_NAV_COOKIE_KEY}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
}
export { OpenKeyNavStoreProvider, OpenKeyNavStoreContext, readOpenKeyNavCookie, deleteOpenKeyNavCookie };
export default useOpenKeyNavStore;
