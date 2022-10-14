We currently have no schema that describes the Entity documents the Portal relies on.
We have requested a schema from PSC, and they have been unable to provide it.
This directory contains scripts for pulling down documents,
describing their fields,
and validating documents against proposed schemas.

If anything comes of this,
it might be incorporated in the validatation hook we already have in
[`search-api`](https://github.com/hubmapconsortium/search-api/pull/564):
This wouldn't cause indexing to fail,
but it would alert us to unexpected changes in document structure.

- `get_entities.py` populates a gitignored `cache/` directory with documents.
- `validate_entities.py` checks the documents in `cache/` against `schema/`.