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


def _make_hashable(val):
    if isinstance(val, list):
        return tuple(val)
    if isinstance(val, dict):
        return tuple(sorted(val.items()))
    return val


def _compute_field_stats(entities, field_name):
    values = []
    non_null_indices = set()
    for i, entity in enumerate(entities):
        val = entity.get(field_name)
        if val is not None and val != '':
            values.append(_make_hashable(val))
            non_null_indices.add(i)
    distinct = len(set(values))
    return distinct, distinct == len(entities), non_null_indices


def compute_overlapping_fields(field_names, non_null_maps, row_count):
    all_rows = set(range(row_count))
    result = {}
    for field in field_names:
        field_rows = non_null_maps[field]
        if not field_rows:
            result[field] = []
        elif field_rows == all_rows:
            result[field] = 'all'
        else:
            result[field] = [other for other in field_names if field_rows <= non_null_maps[other]]
    return result


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

    non_null_maps = {}
    field_stats = {}
    for field_name in ordered_fields:
        cardinality, is_unique, non_null_indices = _compute_field_stats(entities, field_name)
        field_stats[field_name] = (cardinality, is_unique)
        non_null_maps[field_name] = non_null_indices

    overlapping = compute_overlapping_fields(ordered_fields, non_null_maps, row_count)

    fields = []
    for field_name in ordered_fields:
        cardinality, is_unique = field_stats[field_name]
        dp_type = types_dict.get(field_name, 'string')
        fields.append(
            {
                'name': field_name,
                'type': dp_type,
                'description': descriptions_dict.get(field_name, ''),
                'udi:cardinality': cardinality,
                'udi:unique': is_unique,
                'udi:data_type': _udi_data_type(dp_type),
                'udi:overlapping_fields': overlapping[field_name],
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
