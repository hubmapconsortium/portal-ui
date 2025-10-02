import OpenKeyNav from 'openkeynav';
import useOpenKeyNavStore from 'js/stores/useOpenKeyNavStore';

function useInitializeOpenKeyNav() {
  const initialize = useOpenKeyNavStore((s) => s.initialize);

  if (initialize) {
    const openKeyNav = new OpenKeyNav();
    openKeyNav
      .init({
        keys: {
          menu: '/',
          modifierKey: 'metaKey',
        },
        debug: {
          keyboardAccessible: false,
        },
      })
      .enable();
  }
}

function OpenKeyNavInitializer() {
  useInitializeOpenKeyNav();

  return null;
}

export default OpenKeyNavInitializer;
