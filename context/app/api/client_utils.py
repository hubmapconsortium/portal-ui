def files_from_response(response_json):
    '''
    >>> response_json = {'hits': {'hits': [
    ...     {
    ...         '_id': '1234',
    ...         '_source': {
    ...             'files': [{
    ...                 'rel_path': 'abc.txt'
    ...             }]
    ...         }
    ...     }
    ... ]}}
    >>> files_from_response(response_json)
    {'1234': ['abc.txt']}
    '''
    hits = response_json['hits']['hits']
    return {
        hit['_id']: [
            file['rel_path'] for file in hit['_source'].get('files', [])
        ] for hit in hits
    }
