# JSON Schemas

We validate each document against two separate schemas:
`entity.yml`, and an entity type specific schema.
The later schema only enforces the set of properties,
while `entity.yml` defines the structure of each property.
(I am not sure this is best for the long term, but it works for now.)

We take this approach because JSON Schema doesn't really accommodate
a strict object-oriented approach.
[The docs explain](https://json-schema.org/understanding-json-schema/reference/combining.html#allof):

> Unfortunately, now the schema will reject everything. This is because the Properties refers to the entire schema. And that entire schema includes no properties, and knows nothing about the properties in the subschemas inside of the allOf array.
>
> This shortcoming is perhaps one of the biggest surprises of the combining operations in JSON schema: it does not behave like inheritance in an object-oriented language. There are some proposals to address this in the next version of the JSON schema specification.
