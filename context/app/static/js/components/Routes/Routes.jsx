import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'js/components/Contexts';
import Error from 'js/pages/Error';
import Route from './Route';
import useSendPageView from './useSendPageView';
import useSetUrlBeforeLogin from './useSetUrlBeforeLogin';

const Donor = lazy(() => import('js/pages/Donor'));
const Dataset = lazy(() => import('js/pages/Dataset'));
const Sample = lazy(() => import('js/pages/Sample'));
const Collection = lazy(() => import('js/pages/Collection'));
const Home = lazy(() => import('js/pages/Home/Home'));
const DevSearch = lazy(() => import('js/pages/search/DevSearch'));
const Search = lazy(() => import('js/pages/search/S'));
const Diversity = lazy(() => import('js/pages/Diversity'));
const Preview = lazy(() => import('js/pages/Preview'));
const Publications = lazy(() => import('js/pages/Publications'));
const Publication = lazy(() => import('js/pages/Publication'));
const Services = lazy(() => import('js/pages/Services'));
const Collections = lazy(() => import('js/pages/Collections'));
const BiomarkerAndCellTypeSearch = lazy(() => import('js/pages/BiomarkerAndCellTypeSearch'));
const Markdown = lazy(() => import('js/components/Markdown'));
const SavedLists = lazy(() => import('js/pages/SavedLists'));
const SavedList = lazy(() => import('js/pages/SavedList'));
const LineUpPage = lazy(() => import('js/pages/LineUpPage'));
const Organs = lazy(() => import('js/pages/Organs'));
const Organ = lazy(() => import('js/pages/Organ'));
const Workspaces = lazy(() => import('js/pages/Workspaces'));
const Workspace = lazy(() => import('js/pages/Workspace'));
const Invitation = lazy(() => import('js/pages/Invitation'));
const WorkspacePleaseWait = lazy(() => import('js/pages/WorkspacePleaseWait'));
const Templates = lazy(() => import('js/pages/Templates'));
const Template = lazy(() => import('js/pages/Template'));
const GeneDetails = lazy(() => import('js/pages/Genes'));
const Biomarkers = lazy(() => import('js/pages/Biomarkers'));
const CellTypes = lazy(() => import('js/pages/CellTypes'));
const CellTypesLandingPage = lazy(() => import('js/pages/CellTypesLandingPage'));
const Tutorials = lazy(() => import('js/pages/Tutorials'));
const Tutorial = lazy(() => import('js/pages/Tutorial'));
const Profile = lazy(() => import('js/pages/Profile'));
const Figure = lazy(() => import('js/pages/Figure'));

function Routes({ flaskData } = {}) {
  const {
    entity,
    vitessce_conf,
    title,
    markdown,
    errorCode,
    list_uuid,
    entities,
    organs,
    organs_count,
    organ,
    vignette_json,
    geneSymbol,
    cell_type: cellId,
    tutorialName,
    type,
  } = flaskData;
  const urlPath = window.location.pathname;
  const url = window.location.href;

  useSendPageView(urlPath);
  useSetUrlBeforeLogin(url);

  const { isAuthenticated } = useAppContext();

  if (errorCode !== undefined) {
    return <Error errorCode={errorCode} urlPath={urlPath} isAuthenticated={isAuthenticated} />;
  }

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <Route>
        <Donor />
      </Route>
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <Route>
        <Sample />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/dataset/') || urlPath.startsWith('/browse/support/')) {
    return (
      <Route>
        <Dataset assayMetadata={entity} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Route>
        <Collection collection={entity} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/publication/')) {
    return (
      <Route>
        <Publication publication={entity} vignette_json={vignette_json} />
      </Route>
    );
  }

  if (urlPath === '/') {
    return (
      <Route disableWidthConstraint>
        <Home organsCount={organs_count} />
      </Route>
    );
  }

  if (urlPath.startsWith('/search/biomarkers-cell-types')) {
    return (
      <Route>
        <BiomarkerAndCellTypeSearch />
      </Route>
    );
  }

  if (urlPath.startsWith('/search')) {
    return (
      <Route>
        <Search type={type} />
      </Route>
    );
  }

  if (urlPath.startsWith('/dev-search')) {
    return (
      <Route>
        <DevSearch />
      </Route>
    );
  }

  if (urlPath.startsWith('/diversity')) {
    return (
      <Route>
        <Diversity />
      </Route>
    );
  }

  if (urlPath.startsWith('/preview')) {
    return (
      <Route>
        <Preview title={title} vitData={vitessce_conf} assayMetadata={entity} markdown={markdown} />
      </Route>
    );
  }

  if (urlPath === '/publications') {
    return (
      <Route>
        <Publications />
      </Route>
    );
  }

  if (urlPath === '/organs') {
    return (
      <Route>
        <Organs organs={organs} />
      </Route>
    );
  }

  if (urlPath.startsWith('/organs/')) {
    return (
      <Route>
        <Organ organ={organ} />
      </Route>
    );
  }

  if (urlPath === '/services') {
    return (
      <Route>
        <Services />
      </Route>
    );
  }

  if (urlPath === '/collections') {
    return (
      <Route>
        <Collections />
      </Route>
    );
  }

  if (urlPath === '/my-lists') {
    return (
      <Route>
        <SavedLists />
      </Route>
    );
  }

  if (urlPath.startsWith('/my-lists/')) {
    return (
      <Route>
        <SavedList listUUID={list_uuid} />
      </Route>
    );
  }

  if (urlPath === '/workspaces') {
    return (
      <Route>
        <Workspaces />
      </Route>
    );
  }

  if (urlPath.startsWith('/workspaces/start/')) {
    const workspaceId = parseInt(urlPath.split('/').pop(), 10);
    return (
      <Route>
        <WorkspacePleaseWait workspaceId={workspaceId} />
      </Route>
    );
  }

  if (urlPath.startsWith('/workspaces/')) {
    const workspaceId = parseInt(urlPath.split('/').pop(), 10);
    return (
      <Route>
        <Workspace workspaceId={workspaceId} />
      </Route>
    );
  }

  if (urlPath.startsWith('/invitations/')) {
    const invitationId = parseInt(urlPath.split('/').pop(), 10);
    return (
      <Route>
        <Invitation invitationId={invitationId} />
      </Route>
    );
  }

  if (urlPath === '/templates') {
    return (
      <Route>
        <Templates />
      </Route>
    );
  }

  if (urlPath.startsWith('/templates/')) {
    const templateKey = urlPath.split('/').pop();
    return (
      <Route>
        <Template templateKey={templateKey} />
      </Route>
    );
  }

  if (urlPath === '/profile') {
    return (
      <Route>
        <Profile />
      </Route>
    );
  }

  if (urlPath === '/data-overview') {
    return (
      <Route>
        <Figure />
      </Route>
    );
  }

  if (urlPath.startsWith('/lineup/')) {
    return (
      <Route>
        <LineUpPage entities={entities} />
      </Route>
    );
  }

  if (urlPath === '/client-side-error') {
    throw Error('Intentional client-side-error');
  }

  if (urlPath.startsWith('/cell-types')) {
    if (cellId === undefined) {
      return (
        <Route>
          <CellTypesLandingPage />
        </Route>
      );
    }
    return (
      <Route>
        <CellTypes cellId={cellId} />
      </Route>
    );
  }

  if (urlPath.startsWith('/genes/')) {
    return (
      <Route>
        <GeneDetails geneSymbol={geneSymbol} />
      </Route>
    );
  }

  if (urlPath.startsWith('/biomarkers')) {
    return (
      <Route>
        <Biomarkers />
      </Route>
    );
  }

  if (urlPath.startsWith('/tutorials')) {
    if (tutorialName) {
      return (
        <Route>
          <Tutorial tutorialName={tutorialName} />
        </Route>
      );
    }

    return (
      <Route>
        <Tutorials />
      </Route>
    );
  }

  if ('markdown' in flaskData) {
    return (
      <Route>
        <Markdown markdown={markdown} />
      </Route>
    );
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    publications: PropTypes.object,
    entity: PropTypes.object,
    entities: PropTypes.array,
    vitessce_conf: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    markdown: PropTypes.string,
    collection: PropTypes.object,
    errorCode: PropTypes.number,
    list_uuid: PropTypes.string,
    has_notebook: PropTypes.bool,
    vis_lifted_uuid: PropTypes.string,
    organ: PropTypes.object,
    organs: PropTypes.object,
    metadata: PropTypes.object,
    organs_count: PropTypes.number,
    vignette_json: PropTypes.object,
    geneSymbol: PropTypes.string,
    redirected_from: PropTypes.string,
    cell_type: PropTypes.string,
    globusGroups: PropTypes.object,
    redirected: PropTypes.bool,
    type: PropTypes.string,
  }),
};

export default Routes;
