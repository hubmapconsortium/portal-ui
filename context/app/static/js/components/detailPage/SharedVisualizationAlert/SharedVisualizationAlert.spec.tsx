import React, { PropsWithChildren } from 'react';
import LZString from 'lz-string';
import { render, screen, AllTheProviders } from 'test-utils/functions';

import { AppContext, AppContextType } from 'js/components/Contexts';
import { InitialHashContext } from 'js/hooks/useInitialHash';
import { useDatasetsAccess, DatasetPermissionsResponse } from 'js/hooks/useDatasetPermissions';
import { SHARED_TOKEN_PLACEHOLDER } from 'js/components/detailPage/visualization/vitessceTokens';
import SharedVisualizationAlert from './SharedVisualizationAlert';

// The permissions lookup POSTs to the softAssay API; stub it so each case can state the verdict.
vi.mock('js/hooks/useDatasetPermissions', () => ({ useDatasetsAccess: vi.fn() }));
const mockedUseDatasetsAccess = vi.mocked(useDatasetsAccess);

const uuid = '0123456789abcdef0123456789abcdef';

function encodeFragment(conf: object) {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(conf));
  return `#vitessce_conf_length=${compressed.length}&vitessce_conf_version=0.0.1&vitessce_conf=${compressed}`;
}

const nonPublicConf = { url: `https://assets.example.com/${uuid}/x.ome.tif?token=${SHARED_TOKEN_PLACEHOLDER}` };
const publicConf = { url: `https://assets.example.com/${uuid}/x.ome.tif` };

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

function mockAccess(accessibleDatasets: DatasetPermissionsResponse, isLoading = false) {
  mockedUseDatasetsAccess.mockReturnValue({ accessibleDatasets, isLoading });
}

const loginPrompt = /includes data that is not publicly available/;
const noAccessPrompt = /your account does not have access to/;

describe('SharedVisualizationAlert', () => {
  beforeEach(() => {
    mockAccess({});
  });

  describe('logged out', () => {
    test('prompts to log in when the link references non-public data', () => {
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: '' });

      expect(screen.getByText(loginPrompt)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'log in' })).toHaveAttribute('href', '/login');
    });

    test('does not look up permissions, since there is no token to authorize with', () => {
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: '' });

      expect(mockedUseDatasetsAccess).toHaveBeenCalledWith([]);
    });
  });

  describe('logged in', () => {
    test('warns when the account lacks access to the referenced dataset', () => {
      mockAccess({ [uuid]: { valid_id: true, access_allowed: false } });
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

      expect(screen.getByText(noAccessPrompt)).toBeInTheDocument();
      expect(screen.queryByText(loginPrompt)).not.toBeInTheDocument();
    });

    test('stays hidden when the account has access', () => {
      mockAccess({ [uuid]: { valid_id: true, access_allowed: true } });
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

      expect(screen.queryByText(noAccessPrompt)).not.toBeInTheDocument();
    });

    test('checks the uuids the shared config references', () => {
      mockAccess({ [uuid]: { valid_id: true, access_allowed: true } });
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

      expect(mockedUseDatasetsAccess).toHaveBeenCalledWith([uuid]);
    });

    test('stays hidden while the permissions lookup is in flight', () => {
      mockAccess({}, true);
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

      expect(screen.queryByText(noAccessPrompt)).not.toBeInTheDocument();
    });

    // Failing safe: an unrecognized id or a failed request must not be reported as a permissions
    // problem, since `access_allowed` is simply absent in both cases.
    test('stays hidden when the permissions API returns no verdict', () => {
      mockAccess({ [uuid]: { valid_id: false } });
      renderAlert({ hash: encodeFragment(nonPublicConf), groupsToken: 'fakeGroupsToken' });

      expect(screen.queryByText(noAccessPrompt)).not.toBeInTheDocument();
    });
  });

  test('stays hidden when the shared config needs no credentials', () => {
    renderAlert({ hash: encodeFragment(publicConf), groupsToken: '' });

    expect(screen.queryByText(loginPrompt)).not.toBeInTheDocument();
    expect(screen.queryByText(noAccessPrompt)).not.toBeInTheDocument();
  });

  test('stays hidden when the URL carries no shared config', () => {
    renderAlert({ hash: '#attribution', groupsToken: '' });

    expect(screen.queryByText(loginPrompt)).not.toBeInTheDocument();
    expect(screen.queryByText(noAccessPrompt)).not.toBeInTheDocument();
  });
});
