from flask import flash

import jsonschema


def flash_validation_errors(entity, schema):
    validator = jsonschema.Draft7Validator(schema)
    for error in validator.iter_errors(entity):
        schema_cursor = schema
        path = list(error.schema_path)
        path[-1] = path[-1] + '_TODO'
        for path_component in path:
            if path_component in schema_cursor:
                schema_cursor = schema_cursor[path_component]
            else:
                schema_cursor = None
                break
        error.issue_url = schema_cursor
        flash(error)
