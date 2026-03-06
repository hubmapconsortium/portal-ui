import React, { lazy } from 'react';
import { useAppContext } from 'js/components/Contexts';
import type {
  Entity,
  Collection as CollectionType,
  Publication as PublicationType,
  ESEntityType,
} from 'js/components/types';
import type { OrganFile } from 'js/components/organ/types';
import ErrorPage from 'js/pages/Error';
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

interface RoutesProps {
  flaskData: FlaskData;
}

function Routes({ flaskData }: RoutesProps) {
  const {
    entity,
    vitessce_conf,
    title,
    markdown,
    errorCode,
    list_uuid,
    organs,
    organs_count,
    organ,
    vignette_json,
    geneSymbol,
    cell_type: cellId,
    tutorialName,
    type,
    integrated,
  } = flaskData;
  const urlPath = window.location.pathname;

  useSendPageView(urlPath);
  useSetUrlBeforeLogin();

  const { isAuthenticated } = useAppContext();

  if (errorCode !== undefined) {
    return <ErrorPage errorCode={errorCode} urlPath={urlPath} isAuthenticated={isAuthenticated} />;
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
        <Dataset assayMetadata={entity as Entity} integrated={integrated} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/collection/')) {
    return (
      <Route>
        <Collection collection={entity as CollectionType} />
      </Route>
    );
  }

  if (urlPath.startsWith('/browse/publication/')) {
    return (
      <Route>
        <Publication
          publication={entity as PublicationType}
          vignette_json={
            vignette_json as unknown as { vignettes: import('js/components/publications/types').PublicationVignette[] }
          }
        />
      </Route>
    );
  }

  if (urlPath === '/') {
    return (
      <Route disableWidthConstraint>
        <Home organsCount={organs_count!} />
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
        <Search type={type as 'donors' | 'samples' | 'datasets'} />
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
        <Organs organs={organs as unknown as Record<string, OrganFile>} />
      </Route>
    );
  }

  if (urlPath.startsWith('/organs/')) {
    return (
      <Route>
        <Organ organ={organ as unknown as OrganFile} />
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
        <SavedList listUUID={list_uuid!} />
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
    const workspaceId = parseInt(urlPath.split('/').pop()!, 10);
    return (
      <Route>
        <WorkspacePleaseWait workspaceId={workspaceId} />
      </Route>
    );
  }

  if (urlPath.startsWith('/workspaces/')) {
    const workspaceId = parseInt(urlPath.split('/').pop()!, 10);
    return (
      <Route>
        <Workspace workspaceId={workspaceId} />
      </Route>
    );
  }

  if (urlPath.startsWith('/invitations/')) {
    const invitationId = parseInt(urlPath.split('/').pop()!, 10);
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
    const templateKey = urlPath.split('/').pop()!;
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
    const entityType = urlPath.split('/').pop()!.replace(/s$/, '').toLowerCase(); // remove trailing 's', e.g. 'samples' -> 'sample'

    if (!['donor', 'sample', 'dataset'].includes(entityType)) {
      return <ErrorPage errorCode={404} urlPath={urlPath} isAuthenticated={isAuthenticated} />;
    }

    const uuidsParam = new URLSearchParams(window.location.search).get('uuids');
    const uuids = uuidsParam?.split(',');

    return (
      <Route>
        <LineUpPage entityType={entityType as ESEntityType} uuids={uuids} />
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
        <GeneDetails geneSymbol={geneSymbol!} />
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
          <Tutorial tutorialRoute={tutorialName} />
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
        <Markdown markdown={markdown!} />
      </Route>
    );
  }

  return undefined;
}

export default Routes;
