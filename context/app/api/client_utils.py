def files_from_response(response_json):
    '''
    >>> response_json = [
    ...     {
    ...         '_id': '1234',
    ...         '_source': {
    ...             'files': [{
    ...                 'rel_path': 'abc.txt'
    ...             }]
    ...         }
    ...     }
    ... ]
    >>> files_from_response(response_json)
    {'1234': ['abc.txt']}
    '''
    return {
        hit['_id']: [
            file['rel_path'] for file in hit['_source']['files']
        ] for hit in response_json
    }
