from pathlib import Path
from yaml import safe_load as load_yaml


def _get_ingest_docs_path():
    return Path(__file__).parent.parent / 'ingest-validation-tools' / 'docs'


def _get_ingest_src_path():
    return Path(__file__).parent.parent / 'ingest-validation-tools' / 'src'


# TODO: I realize there are changes I should make in the submodules
# to make this tractable.
# def get_submission_field_descriptions(entity_type):


def get_submission_instructions_md(entity_type):
    '''
    >>> af_md = get_submission_instructions_md('af')
    >>> assert '# af' in af_md

    '''
    return (
        _get_ingest_docs_path() / entity_type / 'README.md'
    ).read_text()


def get_submission_template_tsv(entity_type):
    '''
    >>> af_tsv = get_submission_template_tsv('af')
    >>> assert 'donor_id\\t' in af_tsv

    '''
    return (
        _get_ingest_docs_path() / entity_type / 'template.tsv'
    ).read_text()



def get_search_api_field_descriptions():
    '''
    >>> descriptions = get_search_api_field_descriptions()
    >>> descriptions['entity_type']
    'The entity type.'

    '''
    yaml_path = (Path(__file__).parent.parent / 'search-schema'
        / 'data' / 'definitions.yaml')
    definitions = load_yaml(yaml_path.read_text())
    return {
        name: props['description']
        for name, props in definitions['fields'].items()
    }
