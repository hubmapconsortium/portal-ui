import jsonschema


def for_each_validation_error(data, schema, callable):
    '''For each validation failure, call a given function with "_TODO" data from the schema'''
    validator = jsonschema.Draft7Validator(schema)
    for error in validator.iter_errors(data):
        schema_cursor = schema
        path = list(error.schema_path)
        path[-1] = path[-1] + '_TODO'
        # 'schema_path' tells us what element in the schema caused an error.
        # When a particular kind of failure is a known issue,
        # we have filed github issues, and if the property that fails is
        # 'foobar', we add 'foobar_TODO' to the schema and put the url there.
        # This is NOT official JSON Schema syntax.
        for path_component in path:
            if path_component in schema_cursor:
                schema_cursor = schema_cursor[path_component]
            else:
                schema_cursor = None
                break
        error.issue_url = schema_cursor
        callable(error)
