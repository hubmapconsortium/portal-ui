import React, { PropsWithChildren } from 'react';
import LZString from 'lz-string';
import { render, screen, AllTheProviders } from 'test-utils/functions';

import { AppContext, AppContextType } from 'js/components/Contexts';
import { InitialHashContext } from 'js/hooks/useInitialHash';
import { SHARED_TOKEN_PLACEHOLDER } from 'js/components/detailPage/visualization/vitessceTokens';
import SharedVisualizationAlert from './SharedVisualizationAlert';

function encodeFragment(conf: object) {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(conf));
  return `#vitessce_conf_length=${compressed.length}&vitessce_conf_version=0.0.1&vitessce_conf=${compressed}`;
}

const nonPublicConf = { url: `https://a/x.ome.tif?token=${SHARED_TOKEN_PLACEHOLDER}` };
const publicConf = { url: 'https://a/x.ome.tif' };

// The initial hash normally comes from window.location at mount; provide it directly so each case
// can vary it. Nest inside AllTheProviders so the inner providers win for this subtree.
function renderAlert({ hash, groupsToken }: { hash: string; groupsToken: string }) {
  const appContext = { groupsToken } as AppContextType;
  const wrapper = ({ children }: PropsWithChildren) => (
    <AllTheProviders>
      <AppContext.Provider value={appContext}>
        <InitialHashContext.Provider value={hash}>{children}</InitialHashContext.Provider>
      </AppContext.Provider>
    </AllTheProviders>
  );
  return render(<SharedVisualizationAlert />, { wrapper });
}

const prompt = /includes data that is not publicly available/;

describe('SharedVisualizationAlert', () => {
  test('prompts a logged-out visitor holding a link to non-public data', () => {
    renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: '' });

    expect(screen.getByText(prompt)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'log in' })).toHaveAttribute('href', '/login');
  });

  test('stays hidden for a logged-in visitor', () => {
    renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

    expect(screen.queryByText(prompt)).not.toBeInTheDocument();
  });

  test('stays hidden when the shared config needs no credentials', () => {
    renderAlert({ hash: encodeFragment(publicConf), groupsToken: '' });

    expect(screen.queryByText(prompt)).not.toBeInTheDocument();
  });

  test('stays hidden when the URL carries no shared config', () => {
    renderAlert({ hash: '#attribution', groupsToken: '' });

    expect(screen.queryByText(prompt)).not.toBeInTheDocument();
  });
});
