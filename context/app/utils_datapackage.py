_XSD_TO_HMFIELD = {
    'anyURI': 'string',
    'float': 'number',
    'decimal': 'number',
    'long': 'number',
    'int': 'integer',
    'dateTime': 'datetime',
}

_HMFIELD_TO_DATAPACKAGE = {
    'string': 'string',
    'number': 'number',
    'integer': 'integer',
    'boolean': 'boolean',
    'datetime': 'datetime',
    'date': 'date',
}


def resolve_field_type(field_type_entry):
    """
    Given a UBKG field-types entry, resolve to a Frictionless DataPackage type string.

    >>> resolve_field_type({'types': [{'type': 'number', 'type_source': 'HMFIELD'}]})
    'number'
    >>> resolve_field_type({'types': [{'type': 'float', 'type_source': 'XSD'}]})
    'number'
    >>> resolve_field_type({'types': [{'type': 'anyURI', 'type_source': 'XSD'}]})
    'string'
    >>> resolve_field_type({'types': []})
    'string'
    """
    types = field_type_entry.get('types', [])
    hmfield_types = [t for t in types if t.get('type_source') == 'HMFIELD']
    if hmfield_types:
        raw_type = hmfield_types[0]['type']
    elif types:
        raw_type = _XSD_TO_HMFIELD.get(types[0]['type'], types[0]['type'])
    else:
        return 'string'
    return _HMFIELD_TO_DATAPACKAGE.get(raw_type, 'string')


def _udi_data_type(datapackage_type):
    """
    >>> _udi_data_type('number')
    'quantitative'
    >>> _udi_data_type('integer')
    'quantitative'
    >>> _udi_data_type('string')
    'nominal'
    """
    if datapackage_type in ('number', 'integer'):
        return 'quantitative'
    return 'nominal'


# UBKG descriptions are written per-field and context-free, so near-synonyms
# read as equally good choices to the chat agent. These overrides say which
# field to reach for. They apply to the UDI datapackage only -- the regular
# metadata exports still carry the UBKG text.
#
# The description is the one channel that reaches the agent's routing prompt
# intact: udiagent renders each field's domain with a value cap, but prints
# `description` in full. So anything the agent needs to know about how these
# fields relate to each other has to be said here.
_FIELD_DESCRIPTION_OVERRIDES = {
    'raw_dataset_type': (
        'The assay that produced this dataset, and the field to use for any '
        'question about assay type, dataset type, modality, or "what kind of '
        'data is this". In HuBMAP "assay type" and "dataset type" are the same '
        'thing and are used interchangeably; this field answers both. Populated '
        'for every dataset.'
    ),
    'dataset_type': (
        'The same assay as raw_dataset_type, but suffixed with the processing '
        'pipeline that produced it (e.g. "RNAseq [Salmon]"). Higher cardinality '
        'and not always populated; prefer raw_dataset_type for filtering and '
        'grouping, and use this only when the pipeline suffix itself matters.'
    ),
    'soft_assaytype': (
        'Internal machine-readable assay key (e.g. "salmon_rnaseq_10x"). Not a '
        'display label and not what a user means by assay type -- use '
        'raw_dataset_type for that.'
    ),
    'display_subtype': (
        'Pre-humanised label shown in the portal UI. Descriptive only; filter '
        'on raw_dataset_type instead.'
    ),
    'processing': (
        'Whether this is a raw dataset or one derived from it by a processing '
        'pipeline. Datasets and their derivatives both appear as rows, so '
        'filter on this to avoid counting the same experiment twice.'
    ),
    'processing_type': (
        'Who ran the processing pipeline: hubmap, lab, or external. Only '
        'populated for processed datasets.'
    ),
    'donors.hubmap_id': (
        'Every donor this entity derives from, comma-separated. Most entities '
        'have exactly one, but some have several. This column is descriptive '
        'and cannot be joined against the donors table -- join on '
        'donor.hubmap_id, which holds a single donor id.'
    ),
    'donor.hubmap_id': (
        'A single donor id, and the joinable key to the donors table. Where an '
        'entity has several donors this holds only the first; donors.hubmap_id '
        'lists them all.'
    ),
}


def _field_description(field_name, descriptions_dict):
    """
    Portal-specific description for a UDI datapackage field, falling back to
    the UBKG-provided text.

    >>> _field_description('age_value', {'age_value': 'Age of the donor.'})
    'Age of the donor.'
    >>> _field_description('nonesuch', {})
    ''

    An override wins over the UBKG text:

    >>> overridden = _field_description('raw_dataset_type', {'raw_dataset_type': 'UBKG text'})
    >>> overridden.startswith('The assay that produced this dataset')
    True
    >>> 'UBKG text' in overridden
    False

    The override is where the agent learns the portal's own vocabulary, since
    it is the only part of a field's schema entry that reaches the routing
    prompt untruncated:

    >>> 'interchangeably' in overridden
    True
    """
    override = _FIELD_DESCRIPTION_OVERRIDES.get(field_name)
    if override is not None:
        return override
    return descriptions_dict.get(field_name, '')


def _make_hashable(val):
    if isinstance(val, list):
        return tuple(val)
    if isinstance(val, dict):
        return tuple(sorted(val.items()))
    return val


def _compute_field_stats(entities, field_name):
    values = []
    for entity in entities:
        val = entity.get(field_name)
        if val is not None and val != '':
            values.append(_make_hashable(val))
    distinct = len(set(values))
    return distinct, distinct == len(entities)


_FOREIGN_KEYS = {
    'donors': [],
    'samples': [
        {
            'fields': ['donor.hubmap_id'],
            'reference': {'resource': 'donors', 'fields': ['hubmap_id']},
            'udi:cardinality': {'from': 'many', 'to': 'one'},
        },
    ],
    'datasets': [
        {
            'fields': ['donor.hubmap_id'],
            'reference': {'resource': 'donors', 'fields': ['hubmap_id']},
            'udi:cardinality': {'from': 'many', 'to': 'one'},
        },
        {
            'fields': ['donor.hubmap_id'],
            'reference': {'resource': 'samples', 'fields': ['donor.hubmap_id']},
            'udi:cardinality': {'from': 'many', 'to': 'many'},
        },
    ],
}


def build_resource(entity_type, entities, descriptions_dict, types_dict, first_fields):
    if not entities:
        return {
            'name': entity_type,
            'type': 'table',
            'path': f'{entity_type}.tsv',
            'scheme': 'file',
            'format': 'tsv',
            'mediatype': 'text/tsv',
            'encoding': 'utf-8',
            'schema': {
                'fields': [],
                'primaryKey': ['hubmap_id'],
                'foreignKeys': _FOREIGN_KEYS[entity_type],
            },
            'udi:row_count': 0,
            'udi:column_count': 0,
        }

    row_count = len(entities)
    all_field_names = sorted(set().union(*(e.keys() for e in entities)))
    first = [f for f in first_fields if f in all_field_names]
    rest = sorted(set(all_field_names) - set(first_fields))
    ordered_fields = first + rest

    field_stats = {
        field_name: _compute_field_stats(entities, field_name) for field_name in ordered_fields
    }

    fields = []
    for field_name in ordered_fields:
        cardinality, is_unique = field_stats[field_name]
        dp_type = types_dict.get(field_name, 'string')
        fields.append(
            {
                'name': field_name,
                'type': dp_type,
                'description': _field_description(field_name, descriptions_dict),
                'udi:cardinality': cardinality,
                'udi:unique': is_unique,
                'udi:data_type': _udi_data_type(dp_type),
            }
        )

    return {
        'name': entity_type,
        'type': 'table',
        'path': f'{entity_type}.tsv',
        'scheme': 'file',
        'format': 'tsv',
        'mediatype': 'text/tsv',
        'encoding': 'utf-8',
        'schema': {
            'fields': fields,
            'primaryKey': ['hubmap_id'],
            'foreignKeys': _FOREIGN_KEYS[entity_type],
        },
        'udi:row_count': row_count,
        'udi:column_count': len(ordered_fields),
    }
