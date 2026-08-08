import json
import re
import xml.etree.ElementTree as ET

import pytest

from .main import create_app
from .routes_browse import (
    _get_dataset_ld,
    _get_entity_description,
    _get_entity_title,
)

SITEMAP_NS = '{http://www.sitemaps.org/schemas/sitemap/0.9}'


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        with client.session_transaction() as session:
            session['groups_token'] = '{}'
        yield client


def mock_publications_post(publications):
    """Mocks the related-publications lookup with the given `_source` dicts."""

    def post(path, **kwargs):
        class MockResponse:
            def __init__(self):
                self.status_code = 0
                self.text = 'Logger call requires this'

            def json(self):
                return {'hits': {'hits': [{'_source': p} for p in publications]}}

            def raise_for_status(self):
                pass

        return MockResponse()

    return post


@pytest.fixture
def app_context(mocker):
    # _get_dataset_ld reads request.base_url for the `url` field, and queries Elasticsearch
    # for related publications. Default to none, so citation-specific tests opt in.
    mocker.patch('requests.post', side_effect=mock_publications_post([]))
    app = create_app(testing=True)
    with app.test_request_context('/browse/dataset/fake-uuid?redirected=True'):
        yield


DATASET = {
    'entity_type': 'Dataset',
    'uuid': 'fake-uuid',
    'hubmap_id': 'HBM123.ABCD.456',
    'title': 'Histology of Kidney',
    'description': 'Too short.',
    'dataset_type': 'Histology',
    'assay_display_name': ['Histology [Image Pyramid]'],
    'origin_samples_unique_mapped_organs': ['Kidney'],
    'mapped_data_types': ['Histology'],
    'mapped_data_access_level': 'Public',
    'group_name': 'Mock TMC',
    'doi_url': 'https://doi.org/10.35079/HBM123.ABCD.456',
    'registered_doi': '10.35079/HBM123.ABCD.456',
    'published_timestamp': 1572559603311,
    'last_modified_timestamp': 1721426610012,
    'contributors': [
        {
            'first_name': 'Ada',
            'last_name': 'Lovelace',
            'orcid': '0000-0002-1825-0097',
            'affiliation': 'Analytical Engine Institute',
        },
        {'name': 'Grace Hopper', 'first_name': 'Grace', 'last_name': 'Hopper', 'orcid_id': ''},
    ],
    'donor': {
        'mapped_metadata': {
            'sex': ['Male'],
            'race': ['White'],
            'age_value': [70],
            'age_unit': ['years'],
            'medical_history': ['Diabetes'],
        }
    },
}


def test_dataset_ld_core_fields(app_context):
    ld = _get_dataset_ld(DATASET)
    assert ld['@type'] == 'Dataset'
    assert ld['url'] == 'http://localhost/browse/dataset/fake-uuid'
    # The DOI is what lets Google treat this page as a distinct dataset.
    assert 'https://doi.org/10.35079/HBM123.ABCD.456' in ld['identifier']
    assert 'HBM123.ABCD.456' in ld['identifier']
    assert ld['sameAs'] == 'https://doi.org/10.35079/HBM123.ABCD.456'
    assert ld['datePublished'] == '2019-10-31'
    assert ld['dateModified'] == '2024-07-19'
    assert ld['isAccessibleForFree'] is True
    assert ld['includedInDataCatalog']['@type'] == 'DataCatalog'
    assert 'Kidney' in ld['keywords']
    assert ld['measurementTechnique'] == ['Histology [Image Pyramid]']


def test_dataset_ld_name_and_description_are_differentiated(app_context):
    ld = _get_dataset_ld(DATASET)
    # The HuBMAP ID is what makes two datasets from the same donor/organ/assay distinguishable.
    assert ld['name'] == 'Histology of Kidney (HBM123.ABCD.456)'
    # A too-short curated description is prefixed with generated detail rather than used bare,
    # and medical history really does appear (it read a key ES never populates before).
    assert ld['description'] == (
        'Histology of Kidney from White Male, 70 years old, '
        'with a medical history of Diabetes. Too short.'
    )


def test_dataset_ld_does_not_self_cite(app_context):
    """
    `citation` identifies related academic articles, not the dataset itself. Google is
    explicit: "Don't use this property to provide citation information for the dataset
    itself." The dataset's own citation is carried by name, identifier, creator and
    publisher instead.
    https://developers.google.com/search/docs/appearance/structured-data/dataset
    """
    ld = _get_dataset_ld(DATASET)
    # No related publications in this fixture, so `citation` must be absent entirely rather
    # than falling back to a citation of the dataset itself.
    assert 'citation' not in ld
    assert ld['publisher'] == {
        '@type': 'Organization',
        'name': 'HuBMAP Consortium',
        'url': 'https://portal.hubmapconsortium.org',
    }
    # The four properties Google names for the dataset's own citation.
    for required in ['name', 'identifier', 'creator', 'publisher']:
        assert ld[required]


def test_citation_holds_related_publications(mocker):
    """
    `citation` identifies related academic articles. Google asks for the article identifier
    "whenever possible", so each snippet ends in the publication's DOI.
    """
    mocker.patch(
        'requests.post',
        side_effect=mock_publications_post(
            [
                {
                    'uuid': 'pub-2',
                    'title': 'Zebra atlas of the kidney',
                    'publication_venue': 'Nature',
                    'publication_date': '2024-01-15',
                    'publication_doi': '10.1111/222',
                    'contributors': [{'name': 'Doe J'}, {'name': 'Roe R'}],
                },
                {
                    'uuid': 'pub-1',
                    'title': 'A preprint with no DOI',
                    'contributors': [{'first_name': 'Ada', 'last_name': 'Lovelace'}],
                },
            ]
        ),
    )
    app = create_app(testing=True)
    with app.test_request_context('/browse/dataset/fake-uuid'):
        ld = _get_dataset_ld({**DATASET, 'descendant_ids': ['processed-uuid']})

    assert ld['citation'] == [
        'Ada Lovelace. A preprint with no DOI. '
        'https://portal.hubmapconsortium.org/browse/publication/pub-1',
        'Doe J, et al. Zebra atlas of the kidney. Nature; 2024. https://doi.org/10.1111/222',
    ]


def test_citation_query_covers_processed_descendants(mocker):
    """
    A publication may reference a processed descendant rather than the raw dataset, so the
    lookup has to match on the dataset and every descendant.
    """
    post = mocker.patch('requests.post', side_effect=mock_publications_post([]))
    app = create_app(testing=True)
    with app.test_request_context('/browse/dataset/fake-uuid'):
        _get_dataset_ld({**DATASET, 'descendant_ids': ['processed-uuid', 'support-uuid']})

    body = post.call_args.kwargs['json']
    assert body['query']['bool']['filter'][0]['terms']['ancestor_ids.keyword'] == [
        'fake-uuid',
        'processed-uuid',
        'support-uuid',
    ]
    assert body['query']['bool']['filter'][1] == {'term': {'entity_type.keyword': 'Publication'}}


def test_citation_survives_a_failed_publication_lookup(mocker):
    """The rest of the LD is still worth serving if the publication query fails."""
    mocker.patch('requests.post', side_effect=Exception('Elasticsearch is down'))
    app = create_app(testing=True)
    with app.test_request_context('/browse/dataset/fake-uuid'):
        ld = _get_dataset_ld(DATASET)
    assert 'citation' not in ld
    assert ld['name'] == 'Histology of Kidney (HBM123.ABCD.456)'


def test_dataset_ld_creators(app_context):
    ld = _get_dataset_ld(DATASET)
    creators = ld['creator']
    assert creators[0] == {
        '@type': 'Person',
        'name': 'Ada Lovelace',
        'sameAs': 'https://orcid.org/0000-0002-1825-0097',
        'affiliation': {'@type': 'Organization', 'name': 'Analytical Engine Institute'},
    }
    # An empty orcid_id must not produce a bare "https://orcid.org/" link.
    assert 'sameAs' not in creators[1]
    assert creators[-1] == {'@type': 'Organization', 'name': 'Mock TMC'}


def test_dataset_ld_long_description_is_used_verbatim(app_context):
    curated = 'A thorough, curated description of this dataset that stands on its own.'
    ld = _get_dataset_ld({**DATASET, 'description': curated})
    assert ld['description'] == curated


def test_dataset_ld_omits_missing_fields(app_context):
    minimal = {'entity_type': 'Dataset', 'hubmap_id': 'HBM123.ABCD.456'}
    ld = _get_dataset_ld(minimal)
    assert ld['identifier'] == ['HBM123.ABCD.456']
    for absent in ['sameAs', 'creator', 'datePublished', 'dateModified', 'citation']:
        assert absent not in ld
    assert ld['isAccessibleForFree'] is False


@pytest.mark.parametrize('access_level', ['Protected', 'Consortium', None])
def test_dataset_ld_non_public_is_not_free(app_context, access_level):
    ld = _get_dataset_ld({**DATASET, 'mapped_data_access_level': access_level})
    assert ld['isAccessibleForFree'] is False


@pytest.mark.parametrize('entity_type', ['Donor', 'Sample', 'Collection', 'Publication'])
def test_no_ld_for_other_entity_types(app_context, entity_type):
    assert _get_dataset_ld({'entity_type': entity_type, 'hubmap_id': 'HBM1'}) is None


@pytest.mark.parametrize(
    'entity',
    [
        {'entity_type': 'Dataset', 'title': 'T', 'hubmap_id': 'HBM1'},
        {'entity_type': 'Sample', 'hubmap_id': 'HBM1', 'origin_samples_unique_mapped_organs': []},
        {'entity_type': 'Collection', 'title': 'T', 'hubmap_id': 'HBM1'},
        {'entity_type': 'Donor', 'hubmap_id': 'HBM1', 'mapped_metadata': {'sex': ['Male']}},
        # No demographics at all: the ID has to stand in, without leaving a gap behind it.
        {'entity_type': 'Donor', 'hubmap_id': 'HBM1'},
        {'entity_type': 'Sample', 'hubmap_id': 'HBM1'},
    ],
)
def test_meta_text_has_no_stray_whitespace(entity):
    # Backslash line-continuation inside an f-string used to bake source indentation
    # into every served meta description.
    for text in [_get_entity_title(entity), _get_entity_description(entity)]:
        assert not re.search(r'\s{2,}', text), text


DONOR = {
    'entity_type': 'Donor',
    'hubmap_id': 'HBM111.DONOR.222',
    'mapped_metadata': {'age_value': [70], 'age_unit': ['years old'], 'sex': ['Male']},
}

SAMPLE = {
    'entity_type': 'Sample',
    'hubmap_id': 'HBM333.SAMP.444',
    'mapped_sample_category': 'Section',
    'origin_samples_unique_mapped_organs': ['Kidney'],
    'donor': {'mapped_metadata': {'age_value': [70], 'age_unit': ['years old'], 'sex': ['Male']}},
}


@pytest.mark.parametrize(
    'entity,expected_title,expected_in_description',
    [
        (
            {'entity_type': 'Dataset', 'title': 'T', 'hubmap_id': 'HBM1'},
            'T (HBM1) | Dataset',
            'T (HBM1)',
        ),
        (
            SAMPLE,
            'Section from Kidney of 70 years old Male (HBM333.SAMP.444) | Sample',
            'Section from Kidney of 70 years old Male (HBM333.SAMP.444)',
        ),
        (
            DONOR,
            '70 years old Male (HBM111.DONOR.222) | Donor',
            '70 years old Male (HBM111.DONOR.222)',
        ),
    ],
)
def test_titles_include_hubmap_id(entity, expected_title, expected_in_description):
    """
    Datasets, samples and donors all generate titles from shared metadata, so sibling
    entities produce byte-identical titles without the ID.
    """
    assert _get_entity_title(entity) == expected_title
    assert expected_in_description in _get_entity_description(entity)


def test_donor_id_falls_back_when_demographics_are_missing():
    assert _get_entity_title({'entity_type': 'Donor', 'hubmap_id': 'HBM1'}) == 'HBM1 | Donor'


def test_donor_id_does_not_leak_into_dataset_and_sample_titles():
    """
    A dataset or sample title embeds the *donor's* demographics, but must carry only its
    own HuBMAP ID: the donor's would be a second, misleading identifier in the title.
    """
    dataset = {
        'entity_type': 'Dataset',
        'hubmap_id': 'HBM555.DS.666',
        'raw_dataset_type': 'Histology',
        'origin_samples_unique_mapped_organs': ['Kidney'],
        'donor': {'hubmap_id': 'HBM111.DONOR.222', 'mapped_metadata': {'sex': ['Male']}},
    }
    for entity in [dataset, {**SAMPLE, 'donor': {**SAMPLE['donor'], 'hubmap_id': 'HBM111.D.2'}}]:
        title = _get_entity_title(entity)
        assert title.count('(') == 1, title
        assert entity['hubmap_id'] in title
        assert entity['donor']['hubmap_id'] not in title


def test_funder_ror_is_the_common_fund(app_context):
    # https://ror.org/001d55x84 is the NIH Common Fund; 01cwqze88 is NIH itself.
    assert _get_dataset_ld(DATASET)['funder'] == {
        '@type': 'Organization',
        'name': 'NIH Common Fund',
        'sameAs': 'https://ror.org/001d55x84',
    }


def test_canonical_link_drops_query_string(client, mocker):
    from .test_routes_main import mock_prov_get, mock_search_donor_post

    mocker.patch('requests.get', side_effect=mock_prov_get)
    mocker.patch('requests.post', side_effect=mock_search_donor_post)
    response = client.get('/browse/donor/fake-uuid?redirected=True&redirectedFromId=HBM999')
    html = response.data.decode('utf8')
    assert '<link rel="canonical" href="http://localhost/browse/donor/fake-uuid">' in html


def test_no_ld_script_for_non_datasets(client, mocker):
    # The mocked entity is a Donor. The point of the assertion is that the presence of the
    # tag is decided server-side, not by the bundle.
    from .test_routes_main import mock_prov_get, mock_search_donor_post

    mocker.patch('requests.get', side_effect=mock_prov_get)
    mocker.patch('requests.post', side_effect=mock_search_donor_post)
    response = client.get('/browse/donor/fake-uuid')
    assert 'application/ld+json' not in response.data.decode('utf8')


def mock_search_dataset_post(path, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 0
            self.text = 'Logger call requires this'

        def json(self):
            # `processing: raw` keeps details() from redirecting to a primary ancestor.
            return {'hits': {'hits': [{'_source': {**DATASET, 'processing': 'raw'}}]}}

        def raise_for_status(self):
            pass

    return MockResponse()


def test_dataset_ld_is_in_the_served_html(client, mocker):
    """
    The whole point of moving generation server-side: the markup must be in the raw HTML,
    not injected by the JS bundle after Googlebot's render pass.
    """
    from .test_routes_main import mock_prov_get

    mocker.patch('requests.get', side_effect=mock_prov_get)
    mocker.patch('requests.post', side_effect=mock_search_dataset_post)
    response = client.get('/browse/dataset/fake-uuid')
    assert response.status == '200 OK'
    html = response.data.decode('utf8')

    ld = json.loads(
        re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL).group(1)
    )
    assert ld['@type'] == 'Dataset'
    assert ld['name'] == 'Histology of Kidney (HBM123.ABCD.456)'
    assert ld['identifier'] == [
        'HBM123.ABCD.456',
        'https://doi.org/10.35079/HBM123.ABCD.456',
    ]
    assert ld['publisher']['name'] == 'HuBMAP Consortium'
    assert '<link rel="canonical" href="http://localhost/browse/dataset/fake-uuid">' in html
    # <title> and the LD name must agree, and both must carry the differentiating ID.
    assert '<title>Histology of Kidney (HBM123.ABCD.456) | Dataset | HuBMAP</title>' in html


def mock_processed_dataset_post(path, **kwargs):
    """
    Answers both Elasticsearch calls made while redirecting a processed dataset: the
    get_entity lookup (an `ids` query) and the raw-ancestor lookup (a `post_filter` query).
    """
    is_ancestor_lookup = 'post_filter' in (kwargs.get('json') or {})

    class MockResponse:
        def __init__(self):
            self.status_code = 0
            self.text = 'Logger call requires this'

        def json(self):
            if is_ancestor_lookup:
                return {
                    'hits': {
                        'total': {'value': 1},
                        'hits': [
                            {
                                '_id': 'raw-uuid',
                                '_source': {'uuid': 'raw-uuid', 'processing': 'raw'},
                                'sort': ['raw-uuid'],
                            }
                        ],
                    }
                }
            return {
                'hits': {
                    'hits': [
                        {
                            '_source': {
                                'entity_type': 'Dataset',
                                'uuid': 'processed-uuid',
                                'hubmap_id': 'HBM777.PROC.888',
                                'processing': 'processed',
                                'pipeline': 'salmon',
                                'ancestor_ids': ['raw-uuid'],
                            }
                        }
                    ]
                }
            }

        def raise_for_status(self):
            pass

    return MockResponse()


def test_processed_dataset_redirects_permanently(client, mocker):
    """
    Processed datasets are always part of the unified dataset view, so this redirect is
    permanent. A 302 would leave each processed URL canonical in Google's eyes and eligible
    for indexing as a near-duplicate of the primary dataset page.
    """
    mocker.patch('requests.post', side_effect=mock_processed_dataset_post)
    response = client.get('/browse/dataset/processed-uuid')
    assert response.status == '301 MOVED PERMANENTLY'
    assert response.location.startswith('/browse/dataset/raw-uuid')
    assert 'redirectedFromId=HBM777.PROC.888' in response.location


def test_sitemap_index(client):
    response = client.get('/sitemap.xml')
    assert response.status == '200 OK'
    root = ET.fromstring(response.data)
    locs = [loc.text for loc in root.iter(f'{SITEMAP_NS}loc')]
    assert 'http://localhost/sitemap-dataset.xml' in locs
    assert 'http://localhost/sitemap-pages.xml' in locs


def test_sitemap_txt_redirects_to_xml(client):
    response = client.get('/sitemap.txt')
    assert response.status == '301 MOVED PERMANENTLY'
    assert response.location == '/sitemap.xml'


def test_sitemap_pages(client):
    response = client.get('/sitemap-pages.xml')
    assert response.status == '200 OK'
    locs = [loc.text for loc in ET.fromstring(response.data).iter(f'{SITEMAP_NS}loc')]
    assert 'http://localhost/organs' in locs
    assert 'http://localhost/tutorials/getting-started' in locs


def test_sitemap_unknown_entity_type_404s(client):
    assert client.get('/sitemap-gene.xml').status == '404 NOT FOUND'


def mock_sitemap_search_post(path, **kwargs):
    class MockResponse:
        def __init__(self):
            self.status_code = 0
            self.text = 'Logger call requires this'

        def json(self):
            return {
                'hits': {
                    'total': {'value': 1},
                    'hits': [
                        {
                            '_id': 'dataset-uuid',
                            '_source': {'last_modified_timestamp': 1721426610012},
                            'sort': ['dataset-uuid'],
                        }
                    ],
                }
            }

        def raise_for_status(self):
            pass

    return MockResponse()


def test_sitemap_entity_includes_lastmod(client, mocker):
    from .routes_browse import _get_sitemap_entities_cached

    # The lookup is memoized per hour bucket; clear it so this test sees the mock.
    _get_sitemap_entities_cached.cache_clear()
    mocker.patch('requests.post', side_effect=mock_sitemap_search_post)
    response = client.get('/sitemap-dataset.xml')
    _get_sitemap_entities_cached.cache_clear()

    assert response.status == '200 OK'
    urls = list(ET.fromstring(response.data).iter(f'{SITEMAP_NS}url'))
    assert len(urls) == 1
    assert urls[0].find(f'{SITEMAP_NS}loc').text == 'http://localhost/browse/dataset/dataset-uuid'
    assert urls[0].find(f'{SITEMAP_NS}lastmod').text == '2024-07-19'
