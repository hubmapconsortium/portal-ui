from datetime import datetime, timezone
from functools import cache
from importlib.metadata import version
import json
from math import ceil
import time
from urllib.parse import urlparse, quote
from xml.sax.saxutils import escape as xml_escape

# Private, but so is the `_request` this module already relies on; both come from the
# portal-visualization client that portal-ui pins.
from portal_visualization.client import _paginate_search_after

from .utils import get_organs, get_valid_tutorial_routes

from flask import (
    current_app,
    render_template,
    jsonify,
    abort,
    request,
    redirect,
    url_for,
    Response,
)

from .utils import (
    find_sibling_datasets,
    get_default_flask_data,
    make_blueprint,
    get_client,
    get_url_base_from_request,
    entity_types,
    find_raw_dataset_ancestor,
    should_redirect_entity,
)


blueprint = make_blueprint(__name__)


@blueprint.route('/browse/<possible_hbm_id>')
def hbm_redirect(possible_hbm_id):
    uppercase_possible_hmb_id = possible_hbm_id.upper()
    if not uppercase_possible_hmb_id.startswith('HBM'):
        abort(404)
    client = get_client()
    entity = client.get_entity(hbm_id=uppercase_possible_hmb_id)
    # 301: the HuBMAP ID -> uuid mapping is permanent, so let crawlers and browsers
    # consolidate on the uuid URL.
    return redirect(
        url_for('routes_browse.details', type=entity['entity_type'].lower(), uuid=entity['uuid']),
        code=301,
    )


@blueprint.route('/browse/latest/<type>/<uuid>')
def latest_redirect(type, uuid):
    client = get_client()
    latest_entity_uuid = client.get_latest_entity_uuid(uuid, type)
    return redirect(url_for('routes_browse.details', type=type.lower(), uuid=latest_entity_uuid))


@blueprint.route('/browse/<type>/<uuid>.<unknown_ext>')
def unknown_ext(type, uuid, unknown_ext):
    # https://github.com/pallets/werkzeug/blob/b01fa1817343d2a36a9d8bb17f61ddf209c27c2b/src/werkzeug/routing.py#L1126
    # Rules with static parts come before variable routes...
    # so the known extensions will come before this.
    abort(404)


@blueprint.route('/browse/<type>/<uuid>')
def details(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    actual_type = entity['entity_type'].lower()
    integrated = entity.get('is_integrated')

    if should_redirect_entity(entity):
        raw_dataset = find_raw_dataset_ancestor(client, entity.get('ancestor_ids'))

        anchor = quote(f'section-{entity.get("hubmap_id")}').lower()

        if raw_dataset is None or len(raw_dataset) == 0:
            abort(404)

        marker = request.args.get('marker') or None

        # Redirect to the primary dataset.
        # 301, so search engines fold these URLs into the primary dataset instead of
        # indexing each one as a near-duplicate (a 302 leaves the source URL canonical).
        # Permanent is correct: processed datasets are always part of the unified dataset
        # view and will not get pages of their own.
        return redirect(
            url_for(
                'routes_browse.details',
                type='dataset',
                uuid=raw_dataset[0].get('uuid'),
                _anchor=anchor,
                redirected=True,
                redirectedFromId=entity.get('hubmap_id'),
                redirectedFromPipeline=entity.get('pipeline'),
                marker=marker,
            ),
            code=301,
        )

    if type != actual_type:
        # 301: pure URL normalization, an entity's type never changes.
        return redirect(url_for('routes_browse.details', type=actual_type, uuid=uuid), code=301)

    redirected = request.args.get('redirected') == 'True'

    sibling_ids = []

    if entity['entity_type'].lower() == 'dataset':
        sibling_ids = find_sibling_datasets(client, entity)

    flask_data = {
        **get_default_flask_data(),
        'entity': entity,
        'redirected': redirected,
        'redirectedFromId': request.args.get('redirectedFromId'),
        'redirectedFromPipeline': request.args.get('redirectedFromPipeline'),
        'siblingIds': sibling_ids,
        'integrated': integrated,
    }

    if type == 'publication':
        publication_ancillary_data = client.get_publication_ancillary_json(entity)
        flask_data.update({'vignette_json': publication_ancillary_data.publication_json})

    template = 'base-pages/react-content.html'
    return render_template(
        template,
        type=type,
        uuid=uuid,
        title=_get_entity_title(entity),
        description=_get_entity_description(entity),
        json_ld=_get_dataset_ld(entity),
        flask_data=flask_data,
    )


@blueprint.route('/browse/<type>/<uuid>.json')
def details_json(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    return entity


@blueprint.route('/browse/<type>/<uuid>.vitessce.json')
def details_vitessce(type, uuid):
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    parent_uuid = request.args.get('parent') or None
    marker = request.args.get('marker') or None
    minimal = request.args.get('minimal') == 'True'
    parent = client.get_entity(parent_uuid) if parent_uuid else None

    # ponytail: temporary timer to verify the multi-region SPRM build speedup. Logs which
    # portal-visualization is actually loaded, so a slow time on the pre-fix wheel is obvious.
    build_start = time.perf_counter()
    vitessce_conf = client.get_vitessce_conf_cells_and_lifted_uuid(
        entity, marker=marker, parent=parent, minimal=minimal
    ).vitessce_conf
    current_app.logger.info(
        'vitessce conf build for %s took %.2fs (portal-visualization %s)',
        uuid,
        time.perf_counter() - build_start,
        version('portal-visualization'),
    )
    # Returns a JSON null if there is no visualization.
    response = jsonify(vitessce_conf.conf)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@blueprint.route('/browse/<type>/<uuid>.rui.json')
def details_rui_json(type, uuid):
    # Note that the API returns a blob of JSON as a string,
    # so, to return a JSON object, and not just a string, we need to decode.
    if type not in entity_types:
        abort(404)
    client = get_client()
    entity = client.get_entity(uuid)
    # For samples and datasets, the nearest RUI location is indexed with the entity itself.
    # https://github.com/hubmapconsortium/search-api/pull/860
    if 'rui_location' in entity:
        return json.loads(entity['rui_location'])
    # Otherwise throw 404
    abort(404)


# One sitemap file may hold at most 50k URLs; past that Google rejects the whole file.
# Entity sitemaps are split per type and then paginated within a type, so no served file can
# reach the limit. _render_urlset still logs if one somehow does.
SITEMAP_MAX_URLS = 50000

SITEMAP_ENTITY_TYPES = ['dataset', 'sample', 'donor', 'collection', 'publication']


def _sitemap_page_count(url_count):
    """
    How many files a sitemap of ``url_count`` URLs has to be split into. Always at least one,
    so an entity type with nothing indexed still has a page to serve.

    >>> _sitemap_page_count(0)
    1
    >>> _sitemap_page_count(SITEMAP_MAX_URLS)
    1
    >>> _sitemap_page_count(SITEMAP_MAX_URLS + 1)
    2
    """
    return max(1, ceil(url_count / SITEMAP_MAX_URLS))


def _parse_sitemap_slug(slug):
    """
    Splits the variable part of a `sitemap-<slug>.xml` filename into (entity_type, page).

    Pages are 1-based and only appear in the filename for types that need more than one file,
    so `sitemap-dataset.xml` and `sitemap-dataset-1.xml` are the same first page. Handled here
    rather than with a second `/sitemap-<entity_type>-<int:page>.xml` route, because
    `sitemap-dataset-2.xml` also matches the unnumbered rule and which one Werkzeug prefers
    is not obvious.

    >>> _parse_sitemap_slug('dataset')
    ('dataset', 1)
    >>> _parse_sitemap_slug('dataset-2')
    ('dataset', 2)
    >>> _parse_sitemap_slug('gene-expression')
    ('gene-expression', 1)
    """
    entity_type, _, page = slug.rpartition('-')
    if entity_type and page.isdigit():
        return entity_type, int(page)
    return slug, 1


def _entity_sitemap_names():
    """
    Filenames for every entity sitemap, numbered for any type that has outgrown
    SITEMAP_MAX_URLS. The counts come from the same hour-cached lookup the individual
    sitemaps use, so a warm cache costs the index nothing; a cold one pays for the sweeps
    the sub-sitemaps would have run anyway.
    """
    names = []
    for entity_type in SITEMAP_ENTITY_TYPES:
        pages = _sitemap_page_count(len(_get_sitemap_entities_cached(entity_type, _hour_bucket())))
        if pages == 1:
            names.append(f'sitemap-{entity_type}.xml')
        else:
            names.extend(f'sitemap-{entity_type}-{page}.xml' for page in range(1, pages + 1))
    return names


def _render_urlset(urls):
    """
    Renders a <urlset> sitemap from an iterable of (loc, lastmod) pairs, where lastmod is
    an epoch-millisecond timestamp or None.
    """
    urls = list(urls)
    if len(urls) > SITEMAP_MAX_URLS:
        # Unreachable for entity sitemaps, which are paginated before they get here. This
        # guards the hand-maintained page list, which has no pagination of its own.
        current_app.logger.warning(
            f'Sitemap has {len(urls)} URLs, over the {SITEMAP_MAX_URLS} limit: '
            'the file will be rejected and needs splitting.'
        )
    entries = []
    for loc, lastmod in urls:
        iso_lastmod = _timestamp_to_iso(lastmod)
        lastmod_tag = f'<lastmod>{iso_lastmod}</lastmod>' if iso_lastmod else ''
        entries.append(f'<url><loc>{xml_escape(loc)}</loc>{lastmod_tag}</url>')
    body = '\n'.join(entries)
    return Response(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'{body}\n'
        '</urlset>\n',
        mimetype='application/xml',
    )


@blueprint.route('/sitemap.xml')
def sitemap_index_xml():
    url_base = get_url_base_from_request()
    children = ['sitemap-pages.xml', *_entity_sitemap_names()]
    body = '\n'.join(f'<sitemap><loc>{url_base}/{child}</loc></sitemap>' for child in children)
    return Response(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'{body}\n'
        '</sitemapindex>\n',
        mimetype='application/xml',
    )


@blueprint.route('/sitemap.txt')
def sitemap_txt():
    # Kept as a permanent redirect: Search Console and any external referrers still hold
    # the old plain-text URL, which robots.txt advertised for years.
    return redirect(url_for('routes_browse.sitemap_index_xml'), code=301)


@blueprint.route('/sitemap-pages.xml')
def sitemap_pages_xml():
    url_base = get_url_base_from_request()
    paths = [
        # Landing pages
        '/workspaces',
        '/tutorials',
        '/templates',
        '/organs',
        '/integrated-maps',
        '/collections',
        '/publications',
        # Detail pages
        *[f'/templates/{key}' for key in _get_all_template_keys(_hour_bucket())],
        *[f'/organs/{key}' for key in get_organs()],
        *[f'/tutorials/{route}' for route in get_valid_tutorial_routes()],
    ]
    # No lastmod: these are code- and config-derived, so there is no meaningful per-page date.
    return _render_urlset((f'{url_base}{path}', None) for path in paths)


@blueprint.route('/sitemap-<slug>.xml')
def sitemap_entity_xml(slug):
    entity_type, page = _parse_sitemap_slug(slug)
    if entity_type not in SITEMAP_ENTITY_TYPES:
        abort(404)
    url_base = get_url_base_from_request()
    entities = _get_sitemap_entities_cached(entity_type, _hour_bucket())
    if not 1 <= page <= _sitemap_page_count(len(entities)):
        # 404 rather than an empty urlset: a page past the end is a stale URL, and Search
        # Console reports an empty sitemap it was told about as an error.
        abort(404)
    start = (page - 1) * SITEMAP_MAX_URLS
    return _render_urlset(
        (f'{url_base}/browse/{entity_type}/{uuid}', lastmod)
        for uuid, lastmod in entities[start : start + SITEMAP_MAX_URLS]
    )


@blueprint.route('/robots.txt')
def robots_txt():
    allowed_hostname = 'portal.hubmapconsortium.org'
    hostname = urlparse(request.base_url).hostname
    disallow = '/search' if hostname == allowed_hostname else '/'
    return Response(
        f"""
# This host: {hostname}
# Allowed host: {allowed_hostname}
User-agent: *
Disallow: {disallow}
Sitemap: {get_url_base_from_request()}/sitemap.xml
""",
        mimetype='text/plain',
    )


def _format_donor_title(metadata):
    """
    Formats the donor title based on the metadata.
    <Age> <Age Unit> <Race> <Sex>
    >>> _format_donor_title(None)
    ''
    >>> _format_donor_title({
    ...     'age_value': ['70'],
    ...     'age_unit': ['years old'],
    ...     'race': ['White'],
    ...     'sex': ['Male']})
    '70 years old White Male'
    """

    age = ''
    race = ''
    sex = ''
    if metadata is not None:
        age_value = metadata.get('age_value')
        age_unit = metadata.get('age_unit')
        if age_value is not None and age_unit is not None:
            age = f'{age_value[0]} {age_unit[0]}'
        if metadata.get('race') is not None:
            race = metadata.get('race')[0]
        if metadata.get('sex') is not None:
            sex = metadata.get('sex')[0]

    components = [age, race, sex]

    return ' '.join(c for c in components if c)  # Filter out empty strings


def _format_donor_page_title(entity):
    """
    Title for a donor's own detail page: the demographics, made unique with the HuBMAP ID.

    Deliberately separate from _format_donor_title, which describes the donor *within* a
    dataset or sample title and so must not carry the donor's own ID.

    >>> _format_donor_page_title({'hubmap_id': 'HBM1', 'mapped_metadata': {'sex': ['Male']}})
    'Male (HBM1)'
    >>> _format_donor_page_title({'hubmap_id': 'HBM1'})
    'HBM1'
    """
    return _with_hubmap_id(_format_donor_title(entity.get('mapped_metadata')), entity)


def _with_hubmap_id(title, entity):
    """
    Appends the entity's HuBMAP ID, which is what makes its title unique.

    Donors, samples and datasets all generate titles from demographics, organ and assay, so
    sibling entities share a title byte for byte; Google was excluding the resulting pages
    as duplicates. Publications and collections are curated and already distinct.

    >>> _with_hubmap_id('Section from Kidney', {'hubmap_id': 'HBM1'})
    'Section from Kidney (HBM1)'
    >>> _with_hubmap_id('', {'hubmap_id': 'HBM1'})
    'HBM1'
    >>> _with_hubmap_id('Section from Kidney', {})
    'Section from Kidney'
    """
    hubmap_id = entity.get('hubmap_id')
    if not hubmap_id:
        return title
    return f'{title} ({hubmap_id})' if title else hubmap_id


def _format_dataset_title(entity):
    """
    Returns a dataset's title, or formats a dataset title based on the metadata,
    suffixed with the HuBMAP ID.
    <Assay> of <Organ> of <Donor> (<HuBMAP ID>)

    >>> _format_dataset_title(None)
    'unknown assay of unknown organ of unknown donor'
    >>> _format_dataset_title({
    ...     'raw_dataset_type': 'Histology',
    ...     'hubmap_id': 'HBM123.ABCD.456',
    ...     'origin_samples_unique_mapped_organs': ['Kidney'],
    ...     'donor': {
    ...         'mapped_metadata': {
    ...             'age_value': ['70'],
    ...             'age_unit': ['years old'],
    ...             'race': ['White'],
    ...             'sex': ['Male']
    ...         }
    ...     }
    ... })
    'Histology of Kidney of 70 years old White Male (HBM123.ABCD.456)'
    >>> _format_dataset_title({
    ...     'title': 'Sample Title', 'hubmap_id': 'HBM123.ABCD.456'
    ... })
    'Sample Title (HBM123.ABCD.456)'
    >>> _format_dataset_title({'title': 'Sample Title'})
    'Sample Title'
    """
    if entity is None:
        return 'unknown assay of unknown organ of unknown donor'
    if entity.get('title') is not None:
        title = entity['title']
    else:
        assay = entity.get('raw_dataset_type', 'unknown assay')
        origin_organs = entity.get('origin_samples_unique_mapped_organs')
        organ = ', '.join(origin_organs) if origin_organs else 'unknown organ'

        donor = entity.get('donor')
        donor_description = _format_donor_title(
            donor.get('mapped_metadata') if donor is not None else None
        )
        components = [assay, organ, donor_description]
        title = ' of '.join(c for c in components if c)  # Filter out empty strings

    return _with_hubmap_id(title, entity)


def _format_sample_title(entity):
    """
    Formats a sample title based on the metadata, suffixed with the HuBMAP ID.
    <category> from <organ> of <donor> (<HuBMAP ID>)
    >>> _format_sample_title(None)
    'unknown sample type from unknown organ of unknown donor'
    >>> _format_sample_title({
    ...     'mapped_sample_category': 'Section',
    ...     'hubmap_id': 'HBM123.ABCD.456',
    ...     'origin_samples_unique_mapped_organs': ['Kidney'],
    ...     'donor': {
    ...         'mapped_metadata': {
    ...             'age_value': ['70'],
    ...             'age_unit': ['years old'],
    ...             'race': ['White'],
    ...             'sex': ['Male']
    ...         }
    ...     }
    ... })
    'Section from Kidney of 70 years old White Male (HBM123.ABCD.456)'
    >>> _format_sample_title({'origin_samples_unique_mapped_organs': []})
    'Unknown sample type from unknown organ'
    """
    if entity is None:
        return 'unknown sample type from unknown organ of unknown donor'
    sample_category = entity.get('mapped_sample_category', 'Unknown sample type')
    origin_organs = entity.get('origin_samples_unique_mapped_organs')
    organ = origin_organs[0] if origin_organs else 'unknown organ'
    donor = entity.get('donor')
    donor_description = _format_donor_title(
        donor.get('mapped_metadata') if donor is not None else None
    )
    title = f'{sample_category} from {organ}'
    # Drop the trailing "of" rather than emitting "... of " with nothing after it, which
    # left a dangling preposition and a double space in the served <title>.
    if donor_description:
        title = f'{title} of {donor_description}'
    return _with_hubmap_id(title, entity)


def _truncate_title(title):
    """
    Truncates the title to 50 characters and adds ellipsis if necessary.
    >>> _truncate_title('This is a very long title that exceeds fifty characters')
    'This is a very long title that exceeds fifty chara...'
    """
    if len(title) > 50:
        title = title[0:50] + '...'
    return title


def _get_entity_title(entity):
    """
    Formats the meta title for entity detail pages.
    """
    entity_type = entity.get('entity_type', '').lower()
    match entity_type:
        case 'dataset':
            return f'{_format_dataset_title(entity)} | Dataset'
        case 'sample':
            return f'{_format_sample_title(entity)} | Sample'
        case 'publication':
            title = _truncate_title(entity.get('title', entity.get('hubmap_id')))
            return f'{title} | Publication'
        case 'collection':
            title = _truncate_title(entity.get('title', entity.get('hubmap_id')))
            return f'{title} | Collection'
        case 'donor':
            return f'{_format_donor_page_title(entity)} | Donor'
        case _:
            return f'{entity["hubmap_id"]} | {entity_type.title()}'


@cache
def _get_publication_data_types_and_organs(uuid: str):
    """
    Retrieves an aggregation of all data types and organs associated with the publication.
    This is used to generate the meta description for the publication detail page.
    """
    client = get_client()

    elasticsearch_url = (
        current_app.config['ELASTICSEARCH_ENDPOINT'] + current_app.config['PORTAL_INDEX_PATH']
    )

    # TODO: the search API client does not currently support aggs, so this is
    # an inline definition for the time being.
    request = {
        'query': {
            'bool': {
                'must': [
                    {'bool': {'filter': [{'term': {'descendant_ids': uuid}}]}},
                    {
                        'bool': {
                            'must_not': [
                                {'exists': {'field': 'next_revision_uuid'}},
                                {'exists': {'field': 'sub_status'}},
                            ]
                        }
                    },
                ]
            }
        },
        'aggs': {
            'data_types': {'terms': {'field': 'mapped_data_types.keyword', 'size': 10000}},
            'organs': {'terms': {'field': 'origin_samples.mapped_organ.keyword', 'size': 10000}},
        },
        'size': 0,
    }

    data_types, organs = [[], []]
    try:
        response = client._request(elasticsearch_url, request)
        aggregations = response.get('aggregations')
        data_types = [
            bucket.get('key') for bucket in aggregations.get('data_types').get('buckets')
        ]
        organs = [bucket.get('key') for bucket in aggregations.get('organs').get('buckets')]
    except Exception as e:
        current_app.logger.error(f'Error retrieving publication data types and organs: {e}')
    finally:
        return data_types, organs


# Matches the datasets that have a page of their own, mirroring should_redirect_entity in
# utils.py. Integrated datasets are the first clause and are kept whatever their processing
# state: they are processed, but the front end gives them the IntegratedDataset page variant
# instead of folding them into a primary dataset, so details() does not redirect them.
_DATASET_HAS_OWN_PAGE = {
    'bool': {
        # Explicit, because a bare `should` inside a filter context is easy to misread as
        # optional.
        'minimum_should_match': 1,
        'should': [
            {'term': {'is_integrated': True}},
            {
                'bool': {
                    'filter': [{'term': {'processing.keyword': 'raw'}}],
                    # Components are Multi-Assay Split datasets, which search-api leaves as
                    # `processing: raw`, so the raw filter alone lets them through. must_not
                    # rather than `term: false`: `is_component` is only set on multi-assay
                    # datasets, and a false-match would drop every single-assay dataset.
                    'must_not': [{'term': {'is_component': True}}],
                }
            },
        ],
    }
}


def _sitemap_query(entity_type):
    """
    Datasets are narrowed to the ones a crawler can actually land on. A non-integrated
    processed dataset, and a component dataset, both redirect to their primary dataset, so
    listing them would fill the sitemap with redirects.

    >>> _sitemap_query('sample')
    {'bool': {'filter': [{'term': {'entity_type.keyword': 'Sample'}}]}}
    >>> _sitemap_query('dataset')['bool']['filter'][1] is _DATASET_HAS_OWN_PAGE
    True
    """
    filters = [{'term': {'entity_type.keyword': entity_type.capitalize()}}]
    if entity_type == 'dataset':
        filters.append(_DATASET_HAS_OWN_PAGE)
    return {'bool': {'filter': filters}}


def _hour_bucket():
    """
    Cache key that changes hourly, giving @cache a TTL without a new dependency. The
    sitemap lookups were previously cached for the lifetime of the process, so entities
    published since the last deploy never appeared in the sitemap at all.
    """
    return int(time.time() // 3600)


@cache
def _get_sitemap_entities_cached(entity_type, hour_bucket):
    """
    Returns [(uuid, last_modified_timestamp)] for every entity of the given type.

    ``hour_bucket`` is not used: it is only part of the cache key. See _hour_bucket.
    """
    client = get_client()
    elasticsearch_url = (
        current_app.config['ELASTICSEARCH_ENDPOINT'] + current_app.config['PORTAL_INDEX_PATH']
    )
    query = {
        'size': 10000,  # ES max result window
        'query': _sitemap_query(entity_type),
        '_source': ['last_modified_timestamp'],
        # search_after needs a total order. uuid.keyword is unique, and is already the
        # tiebreaker used for search result sorting in js/components/search/utils.ts.
        'sort': [{'uuid.keyword': 'asc'}],
    }
    try:
        hits = _paginate_search_after(
            lambda body: client._request(elasticsearch_url, body),
            query,
            description=f'{entity_type} sitemap',
        )
    except Exception as e:
        # A sitemap missing entities is better than a 500, but it must be loud: this used to
        # fail silently and truncate at the 10k result window.
        current_app.logger.error(f'Error retrieving {entity_type} uuids for sitemap: {e}')
        return []
    return [
        (hit['_id'], (hit.get('_source') or {}).get('last_modified_timestamp')) for hit in hits
    ]


@cache
def _get_all_template_keys(hour_bucket):
    """
    Retrieves all keys for templates, for the sitemap.

    ``hour_bucket`` is not used: it is only part of the cache key. See _hour_bucket.
    """
    client = get_client()
    templates_url = current_app.config['USER_TEMPLATES_ENDPOINT'] + '/templates/jupyter_lab'
    try:
        return list(client._request(templates_url)['data'].keys())
    except Exception as e:
        # A `finally: return response_json['data'].keys()` here swallowed the request error
        # and then raised KeyError, taking down the whole sitemap. Losing the template pages
        # from one sitemap render is the better failure.
        current_app.logger.error(f'Error retrieving template keys for sitemap: {e}')
        return []


def _get_entity_description(entity):
    """
    Formats the meta description for entity detail pages.

    Note the implicit string concatenation: backslash line-continuation inside an f-string
    bakes the source indentation into the value, which served meta descriptions containing
    long runs of literal spaces.

    >>> '  ' in _get_entity_description({'entity_type': 'Dataset', 'title': 'T'})
    False
    """
    entity_type = entity.get('entity_type', '').lower()
    match entity_type:
        case 'dataset':
            return (
                f'Explore the {_format_dataset_title(entity)} dataset from HuBMAP. '
                'Access and download metadata, visualizations, and analysis tools for research.'
            )
        case 'sample':
            return (
                f'Explore a {_format_sample_title(entity)}. '
                'View metadata and associated datasets for research.'
            )
        case 'publication':
            title = entity.get('title', entity.get('hubmap_id'))
            data_types, organs = _get_publication_data_types_and_organs(entity.get('uuid'))
            return (
                f'Explore HuBMAP publication "{title}", '
                f'featuring data from {", ".join(data_types)} from {", ".join(organs)}. '
                'Access referenced datasets and related visualizations.'
            )
        case 'collection':
            title = entity.get('title', entity.get('hubmap_id'))
            return f'Explore {title} dataset collection. Browse referenced HuBMAP datasets.'
        case 'donor':
            # "a HuBMAP donor" rather than "{demographics} HuBMAP donor": with the ID
            # appended, the old phrasing read "...White Male (HBM1) HuBMAP donor".
            return (
                f'Explore {_format_donor_page_title(entity)}, a HuBMAP donor. '
                'Browse metadata and associated datasets, '
                'and tissue samples for research applications.'
            )
        case _:
            return f'{entity["hubmap_id"]} | {entity_type.title()}'


HUBMAP_PORTAL_URL = 'https://portal.hubmapconsortium.org'
CC_BY_4_0 = 'https://creativecommons.org/licenses/by/4.0/'


def _timestamp_to_iso(timestamp):
    """
    Portal Elasticsearch timestamps are epoch milliseconds.
    >>> _timestamp_to_iso(1572559603311)
    '2019-10-31'
    >>> _timestamp_to_iso(None)
    """
    if not timestamp:
        return None
    return datetime.fromtimestamp(int(timestamp) / 1000, tz=timezone.utc).strftime('%Y-%m-%d')


def _first(metadata, key):
    """
    ``mapped_metadata`` values are indexed as lists, even when single-valued.
    >>> _first({'sex': ['Male']}, 'sex')
    'Male'
    >>> _first({'sex': []}, 'sex')
    >>> _first({}, 'sex')
    """
    values = metadata.get(key) or []
    return values[0] if values else None


def _format_donor_details(mapped_metadata):
    """
    Long-form donor description, used as descriptive fallback text.

    Note the field is ``medical_history``: the previous client-side implementation read a
    camelCase ``medicalHistory`` that Elasticsearch never populates, so every dataset
    description claimed the donor had no medical history.

    >>> _format_donor_details({
    ...     'sex': ['Male'], 'race': ['White'], 'age_value': [70], 'age_unit': ['years'],
    ...     'height_value': [180], 'height_unit': ['cm'],
    ...     'weight_value': [80], 'weight_unit': ['kg'],
    ...     'medical_history': ['Diabetes', 'Cancer']})
    '180 cm, 80 kg, White Male, 70 years old, with a medical history of Diabetes, Cancer'
    >>> _format_donor_details({'sex': ['Male']})
    'Male'
    >>> _format_donor_details(None)
    ''
    """
    if not mapped_metadata:
        return ''

    parts = [
        f'{_first(mapped_metadata, f"{field}_value")} {_first(mapped_metadata, f"{field}_unit")}'
        for field in ['height', 'weight']
        if _first(mapped_metadata, f'{field}_value') is not None
        and _first(mapped_metadata, f'{field}_unit') is not None
    ]

    demographics = ' '.join(
        value
        for value in [_first(mapped_metadata, 'race'), _first(mapped_metadata, 'sex')]
        if value
    )
    if demographics:
        parts.append(demographics)

    age_value = _first(mapped_metadata, 'age_value')
    age_unit = _first(mapped_metadata, 'age_unit')
    if age_value is not None and age_unit:
        parts.append(f'{age_value} {age_unit} old')

    medical_history = mapped_metadata.get('medical_history') or []
    if medical_history:
        parts.append(f'with a medical history of {", ".join(medical_history)}')

    return ', '.join(parts)


def _contributor_name(contributor):
    """
    Contributor schemas differ by version: CEDAR uses ``display_name``, earlier versions use
    ``name``, and either may only carry the split first/last fields.

    >>> _contributor_name({'display_name': 'Lovelace, Ada'})
    'Lovelace, Ada'
    >>> _contributor_name({'first_name': 'Ada', 'last_name': 'Lovelace'})
    'Ada Lovelace'
    >>> _contributor_name({})
    ''
    """
    return (
        contributor.get('name')
        or contributor.get('display_name')
        or ' '.join(
            part for part in [contributor.get('first_name'), contributor.get('last_name')] if part
        )
    )


def _publication_citation(publication):
    """
    Citation snippet for one publication that references this dataset, in the shape Google's
    examples use: descriptive text ending in the article identifier. Their guideline is to
    "provide the article identifier (such as a DOI) whenever possible", so a publication with
    neither a DOI nor a portal page is skipped.

    Mirrors buildNLMCitation in
    js/components/publications/PublicationCitation/PublicationCitation.tsx, including its
    author handling: NLM style wants the byline, which is ``contributors`` in submission
    order. ``contacts`` is the corresponding authors (a flag on contributors in some schema
    versions, a separate array in others) -- correspondence, not byline position, so it is
    not the right list to take a first author from. Nothing in the contributor schemas
    guarantees that order, but it is the order the page's own visible citation uses, and
    markup that named a different first author than the page would be worse than markup that
    inherits the same assumption.

    >>> _publication_citation({
    ...     'title': 'Influence of X', 'publication_venue': 'Nature',
    ...     'publication_date': '2024-01-15', 'publication_doi': '10.1111/111',
    ...     'contributors': [{'name': 'Doe J'}, {'name': 'Roe R'}]})
    'Doe J, et al. Influence of X. Nature; 2024. https://doi.org/10.1111/111'
    >>> _publication_citation({'title': 'Influence of X', 'uuid': 'pub-uuid'})
    'Influence of X. https://portal.hubmapconsortium.org/browse/publication/pub-uuid'
    >>> _publication_citation({'publication_doi': '10.1111/111'})
    'https://doi.org/10.1111/111'
    >>> _publication_citation({})
    """
    doi = publication.get('publication_doi')
    uuid = publication.get('uuid')
    if doi:
        identifier = f'https://doi.org/{doi}'
    elif uuid:
        identifier = f'{HUBMAP_PORTAL_URL}/browse/publication/{uuid}'
    else:
        return None

    names = [
        name for name in map(_contributor_name, publication.get('contributors') or []) if name
    ]
    author = f'{names[0]}, et al' if len(names) > 1 else (names[0] if names else '')
    year = (publication.get('publication_date') or '')[:4]

    parts = [
        f'{author}.' if author else '',
        f'{publication["title"]}.' if publication.get('title') else '',
        f'{publication["publication_venue"]};' if publication.get('publication_venue') else '',
        f'{year}.' if year else '',
    ]
    return ' '.join([*(part for part in parts if part), identifier])


def _get_related_publication_citations(entity):
    """
    Citations for the publications that reference this dataset or any of its processed
    descendants. This is what schema.org `citation` is for: related academic articles, not
    the dataset's own citation, which name/identifier/creator/publisher carry.

    Mirrors buildPublicationsWithDatasetQuery in js/hooks/useDatasetsPublications.ts: a
    publication may reference either the raw dataset or one of its processed descendants,
    and records the reference in its own `ancestor_ids`.
    """
    uuids = [uuid for uuid in [entity.get('uuid'), *(entity.get('descendant_ids') or [])] if uuid]
    if not uuids:
        return []

    # Unauthenticated on purpose: this markup is crawler-facing, so it should describe what
    # an anonymous visitor sees rather than varying with the signed-in user's group access.
    client = get_client(use_groups_token=False)
    elasticsearch_url = (
        current_app.config['ELASTICSEARCH_ENDPOINT'] + current_app.config['PORTAL_INDEX_PATH']
    )
    query = {
        # A dataset cited by more than 100 publications would be unprecedented; the cap is
        # only here so a mapping change cannot turn this into an unbounded response.
        'size': 100,
        'query': {
            'bool': {
                'filter': [
                    {'terms': {'ancestor_ids.keyword': uuids}},
                    {'term': {'entity_type.keyword': 'Publication'}},
                ]
            }
        },
        '_source': [
            'uuid',
            'title',
            'publication_doi',
            'publication_venue',
            'publication_date',
            'contributors',
        ],
    }
    try:
        response = client._request(elasticsearch_url, query)
        hits = response.get('hits', {}).get('hits', [])
    except Exception as e:
        # The dataset page must still render, and the rest of the LD is still worth serving,
        # if the publication lookup fails.
        current_app.logger.error(
            f'Error retrieving related publications for {entity.get("uuid")}: {e}'
        )
        return []

    citations = [_publication_citation(hit.get('_source') or {}) for hit in hits]
    # Sorted because a filter-only query has no meaningful score order, and unstable output
    # would churn the served markup between requests.
    return sorted(citation for citation in citations if citation)


def _contributor_ld(contributor):
    """
    Maps one contributor record to a schema.org Person.

    Contributor schemas differ by version: CEDAR uses ``orcid``/``display_name``, earlier
    versions use ``orcid_id``/``name``. Mirrors ``normalizeContributor`` in
    js/components/detailPage/ContributorsTable/utils.ts.

    >>> _contributor_ld({'display_name': 'Lovelace, Ada', 'orcid': '0000-0002-1825-0097'})
    {'@type': 'Person', 'name': 'Lovelace, Ada', 'sameAs': 'https://orcid.org/0000-0002-1825-0097'}
    >>> _contributor_ld({'first_name': 'Ada', 'last_name': 'Lovelace'})
    {'@type': 'Person', 'name': 'Ada Lovelace'}
    >>> _contributor_ld({})
    """
    name = _contributor_name(contributor)
    if not name:
        return None

    person = {'@type': 'Person', 'name': name}
    orcid = contributor.get('orcid') or contributor.get('orcid_id')
    if orcid:
        person['sameAs'] = f'https://orcid.org/{orcid}'
    affiliation = contributor.get('affiliation')
    if affiliation:
        person['affiliation'] = {'@type': 'Organization', 'name': affiliation}
    return person


def _get_dataset_ld_description(entity):
    """
    Prefers the curated description, and otherwise generates a donor/organ/assay sentence,
    so every dataset page carries differentiated descriptive text.

    >>> _get_dataset_ld_description({'description': 'x' * 50})
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    >>> _get_dataset_ld_description({
    ...     'mapped_data_types': ['snRNAseq'],
    ...     'origin_samples_unique_mapped_organs': ['Kidney'],
    ...     'donor': {'mapped_metadata': {'sex': ['Male']}}})
    'snRNAseq of Kidney from Male.'
    >>> _get_dataset_ld_description({'description': 'Too short.'})
    'unknown assay of unknown organ from an unknown donor. Too short.'
    """
    description = entity.get('description') or ''
    if len(description) >= 50:
        return description

    assay = (
        ', '.join(entity.get('mapped_data_types') or [])
        or entity.get('dataset_type')
        or 'unknown assay'
    )
    organs = ', '.join(entity.get('origin_samples_unique_mapped_organs') or []) or 'unknown organ'
    donor = (
        _format_donor_details((entity.get('donor') or {}).get('mapped_metadata'))
        or 'an unknown donor'
    )
    # A curated description too short to stand alone is kept as a suffix rather than dropped.
    return f'{assay} of {organs} from {donor}. {description}'.strip()


def _get_dataset_ld(entity):
    """
    schema.org Dataset JSON-LD for dataset detail pages, per
    https://developers.google.com/search/docs/appearance/structured-data/dataset

    Returns None for every other entity type, so the template omits the <script> entirely.

    ponytail: no ``distribution``. Bulk download goes through a per-user Globus URL fetched
    at runtime, and the only static alternatives are one DataDownload per file (hundreds of
    entries) or a contentUrl pointing back at this page, which is not a data location.
    ``isAccessibleForFree`` carries the access signal for public datasets instead.

    >>> _get_dataset_ld({'entity_type': 'Donor'})
    """
    if entity.get('entity_type', '').lower() != 'dataset':
        return None

    hubmap_id = entity.get('hubmap_id')
    doi_url = entity.get('doi_url')
    contributors = entity.get('contributors') or []
    assays = entity.get('assay_display_name') or []
    title = _format_dataset_title(entity)

    creators = [person for person in map(_contributor_ld, contributors) if person]
    group_name = entity.get('group_name')
    if group_name:
        creators.append({'@type': 'Organization', 'name': group_name})

    keywords = [
        *(entity.get('origin_samples_unique_mapped_organs') or []),
        *assays,
        *([entity['dataset_type']] if entity.get('dataset_type') else []),
        'HuBMAP',
    ]

    ld = {
        '@context': 'https://schema.org/',
        '@type': 'Dataset',
        'name': title,
        'description': _get_dataset_ld_description(entity),
        'url': request.base_url,
        'license': CC_BY_4_0,
        'keywords': list(dict.fromkeys(keywords)),
        'includedInDataCatalog': {
            '@type': 'DataCatalog',
            'name': 'HuBMAP Data Portal',
            'url': HUBMAP_PORTAL_URL,
        },
        # How a dataset's own citation is expressed: Google's guidance is to "provide the
        # citation for the dataset itself with other properties, such as name, identifier,
        # creator, and publisher". The `citation` property is explicitly NOT for this --
        # it identifies related academic articles, and is populated as such below.
        # HuBMAP has no ROR record, so no sameAs.
        'publisher': {
            '@type': 'Organization',
            'name': 'HuBMAP Consortium',
            'url': HUBMAP_PORTAL_URL,
        },
        # HuBMAP is an NIH Common Fund program. The Common Fund has its own ROR record,
        # https://ror.org/001d55x84 (FundRef 100015326), distinct from NIH's 01cwqze88.
        'funder': {
            '@type': 'Organization',
            'name': 'NIH Common Fund',
            'sameAs': 'https://ror.org/001d55x84',
        },
    }

    optional = {
        # Google clusters dataset replicas by identifier, so the DOI is the single most
        # valuable field for having this page recognized as a distinct dataset. No `sameAs`:
        # that property points at the canonical page when the same dataset is described in
        # more than one place, and a HuBMAP DOI resolves to this very page (see the
        # "leads to the page you are currently viewing" tooltip in
        # js/components/detailPage/Citation/Citation.tsx), so it has no other copy to name.
        'identifier': [value for value in [hubmap_id, doi_url] if value],
        # Omitted rather than set to false for non-public datasets: the restriction is
        # consortium membership, not payment, and `false` reads as a paywall. Only ever true
        # here, since falsy values are dropped below.
        'isAccessibleForFree': entity.get('mapped_data_access_level') == 'Public',
        'creator': creators,
        'datePublished': _timestamp_to_iso(entity.get('published_timestamp')),
        'dateModified': _timestamp_to_iso(entity.get('last_modified_timestamp')),
        'measurementTechnique': assays,
        # Related academic articles, per the property's documented purpose.
        'citation': _get_related_publication_citations(entity),
    }
    ld.update({key: value for key, value in optional.items() if value})
    return ld
