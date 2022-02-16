# HuBMAP IDs and APIs

## IDs

HuBMAP uses three different kinds of IDs:

### HuBMAP ID
- Example: `HBM123.ABCD.456` 
- Used for identification of HuBMAP entities and referencing in HuBMAP context, e.g. in the portal UI, slides, human-human communication, etc.
- Can be used to query portal UI and APIs
- 1:1 mapping to UUID

### UUID
- Example: `0123456789abcdef0123456789abcdef`
- Used for software implementation
- Can be used to query portal UI and API
- 1:1 mapping to HuBMAP ID

### DOI
- Example: `10.1234/HBM123.ABCD.456` 
- Used for referencing outside HuBMAP context, in particular in publications.
- Displayed as: `doi:10.1234/HBM.123.ABCD.456`
- Linked to: `https://doi.org/10.1234/HBM.123.ABCD.456`
- Not all HuBMAP IDs are registered as DOIs.


## APIs
Five application programming interfaces (APIs) currently define 
data ingest support: Ingest, UUID, Search & Index, Entity, and Ontology.  Additionally, the HuBMAP portal uses Common Coordinate Framework (CCF) APIs (created by Indiana University TC) and internal transformation APIs (created by Harvard University TC)

### Ingest API
The Ingest API supports writing data and metadata to HuBMAP. It is used when Tissue Mapping Centers (TMCs) contribute data and also to deposit derived data resulting from the execution of pipelines.
- [GitHub](https://github.com/hubmapconsortium/ingest-ui) 
- [Smart API](https://smart-api.info/ui/5a6bea1158d2652743c7a201fdb1c44d)

### UUID API
The Ingest API supports all donor and tissue sample registration and submission of data and collection of provenance information via the Ingest UI. The Ingest UI is a web user interface used by the Tissue Mapping Centers (TMCs) when contributing raw and derived data which result from the execution of pipelines.
- [GitHub](https://github.com/hubmapconsortium/uuid-api)
- Smart API: currently not available

### Search & Index API
The Search & Index API supports searching and reindexing of HuBMAP metadata and data. The /search endpoint returns sets of data entities matching specifi ed queries for Donors, Tissue Samples and Datasets. The /reindex endpoint is used internally to index new and changed entities, this endpoint is not accessible externally, but only from other APIs that create, update or delete entities.
- [GitHub](https://github.com/hubmapconsortium/search-api)
- [Smart API](https://smart-api.info/ui/7aaf02b838022d564da776b03f357158)

### Ontology API
The Ontology API accesses a Neo4j knowledge graph that allows
extensive cross-referencing across biomedical vocabulary systems.
- [GitHub](https://github.com/hubmapconsortium/hubmap-ontology)
- Smart API: currently not available

### Entity API
The Entity API returns information about HuBMAP data entities (Figure 3). 

Examples of Entity endpoints are as follows:
 - /entities/types: return valid entity types
 - /entities/{identifer}: return specific entities
 - /entities/types/{type_code}: return UUIDs by entity type
 - /entities/{identifier}/provenance: return provenance
   data for entity

**Figure 3.**
![An example HuBMAP entity graph consisting of a donor, organ, blocks, tissue slices, data and derived data from a pipeline. In general, a donor and organ are required in the provenance hierarchy where tissue samples (such as blocks and samples) can be organized based on several different tissue sample types.](https://drive.google.com/file/d/14aAyTItvm3teFB5jUX5TVGRpW4oit99b/view?usp=sharing)

- [GitHub](https://github.com/hubmapconsortium/entity-api) 
- [Smart API](https://smart-api.info/ui/0065e419668f3336a40d1f5ab89c6ba3)
