# HuBMAP Product Offerings: Project Management, Communication, Tracking, & Reporting

### Last Updated: 2/19/2021 

## Description:
The purpose of this document is to categorize HuBMAP efforts through a product management lens in order to structure conversations around, work linkages to, and dependencies among software development level [epics and features](https://www.kbp.media/themes-epics-features-user-stories/).

Linked entries below direct you to the associated code repository if one is present.

## Infratructure/ Base Product

[![Repo diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ1ISVanilVt3vewU6tekVirOxPpTsKMS3zXa8tL0J5JjdT9zS9adgXivm1ZcXxoyC_lctIlHVYhJuI/pub?w=800)](https://docs.google.com/drawings/d/1q0IvliNTX0Xo9EzHTAoRZ2x1gatG_n0gOoLN7uVMJ4o/edit)

- [API Gateway](https://github.com/hubmapconsortium/gateway/blob/test-release/README.md)
- [Common Coordinate Framework (CCF)](https://github.com/hubmapconsortium/hubmap-ontology#readme)
- [Pipeline Container Orchestration](https://github.com/hubmapconsortium/ingest-pipeline) 
- [Documentation](https://github.com/hubmapconsortium/portal-docs#readme) (on Portal)
  - [CCF Checklist and SOPs](https://hubmapconsortium.github.io/ccf/index.html)
  - [MC-IU Onboarding videos](https://hubmapconsortium.github.io/ccf/index.html)
  - [VHMOOC](https://hubmapconsortium.github.io/ccf/index.html)
- Hybrid Cloud Infrastructure
- [Identity system](https://github.com/hubmapconsortium/uuid-api/blob/test-release/README.md)
- [Knowledge Graph](https://github.com/hubmapconsortium/ontology-api#readme)
  - [Schema](https://github.com/dbmi-pitt/UMLS-Graph#readme)
  - Ontology ingest & API service
  - Base biomedical ontologies
- [Microservices Architecture](https://github.com/hubmapconsortium/commons/blob/test-release/README.md)
  - [Provenance services](https://github.com/hubmapconsortium/provenance-metadata-services#readme)
- [Provenance Graph](https://github.com/hubmapconsortium/entity-api/blob/test-release/README.md) (+ core [database](https://github.com/hubmapconsortium/neo4j-docker#readme) using Docker)
- [User registration](https://github.com/hubmapconsortium/member-ui#readme)
- Monitoring services
- [Data Ingest](https://github.com/hubmapconsortium/ingest-ui/)
- [Data Search](https://github.com/hubmapconsortium/search-api/)

## Tissue/ sample prep/ core data
- Dataset generation by data providers (TMCs, RTIs, TTDs)
  - [See list of assays on Portal](https://portal.hubmapconsortium.org/docs/assays)
- DOI generation (DOI registration service)
- [Protocols registration tool](https://www.protocols.io/workspaces/human-biomolecular-atlas-program-hubmap-method-development)(protocols.io)

## Spatial registration and semantic annotation (via 3D collision detection)
- [ASCT+B Reporter](https://github.com/hubmapconsortium/ccf-asct-reporter#readme)
- [CCF reference library](https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html) (body, organs)
- [CCF registration tool](https://github.com/hubmapconsortium/ccf-3d-registration#readme) (RUI)

## Data & Metadata
- Antibody registration tool
- [Data & metadata standards & documentation](https://portal.hubmapconsortium.org/docs/metadata)
- [Data ingest tool](https://github.com/hubmapconsortium/ingest-ui/blob/test-release/README.md) (data & metadata, sample, assay, antibody report, contributor)
- [File transfer interface](https://github.com/hubmapconsortium/sample-data-portal#readme) (Globus)
- [Manual dataset ingest tools](https://github.com/hubmapconsortium/manual-data-ingest#readme)
- Manual donor data ingest process
- [Sequencing data dbGaP submission tool](https://github.com/hubmapconsortium/dbgap-submission-scripts#readme)
- [Tissue & donor registration tool](https://github.com/hubmapconsortium/uuid-ui#readme)

## Pipeline
- [Base QA pipeline](https://github.com/hubmapconsortium/ingest-pipeline) (IEC dataset one)
- Cells API: [cell identification](https://github.com/hubmapconsortium/hubmap-cell-id-gen-py#readme), [backend](https://github.com/hubmapconsortium/cross_modality_query#readme), [js client](https://github.com/hubmapconsortium/hubmap-api-js-client#readme), [py client](https://github.com/hubmapconsortium/hubmap-api-py-client#readme)
- [Data ingest pipeline](https://github.com/hubmapconsortium/ingest-pipeline#readme)
- Pipeline for:
  - [CODEX (Cytokit + SPRM)](https://github.com/hubmapconsortium/codex-pipeline#readme)
  - [“Example Pipeline”](https://github.com/hubmapconsortium/example-pipeline)
  - [Imaging Mass Spectrometry & MxIF](https://github.com/hubmapconsortium/ims-mxif-pipeline#readme)
  - [sc/snATAC-seq](https://github.com/hubmapconsortium/sc-atac-seq-pipeline#readme) (SnapTools, SnapATAC, and chromVAR)
  - [sc/snRNA-seq](https://github.com/hubmapconsortium/salmon-rnaseq/blob/master/README.rst) (Salmon, Scanpy, scVelo)
  - [SPRM](https://github.com/hubmapconsortium/sprm#readme) (Imaging pipeline)
  - Spatial Transcriptomics (Starfish)
- QA metrics service (assay specific pipeline QA metric sharing)
- Tools
  - [Mixed datatype pipeline tools](https://github.com/hubmapconsortium/cross-dataset-common#readme)
  - [OME.TIFF Pyramid](https://github.com/hubmapconsortium/ome-tiff-pyramid)
  - [Pipeline deployment](https://github.com/hubmapconsortium/pipeline-release-mgmt/blob/master/README.rst)
  - [Sequencing (FASTQ) file tools](https://github.com/hubmapconsortium/fastq-utils)
  - [Sequencing (snap) file tools](https://github.com/hubmapconsortium/SnapTools/blob/hubmap-develop/README.md)
  - [Visualization pre-processing](https://github.com/hubmapconsortium/portal-containers#readme)
  - [Vitessce pre-processing](https://github.com/hubmapconsortium/vitessce-data#readme)
  - [Giotto - Analysis of spatial transcriptomics data](https://rubd.github.io/Giotto_site/index.html)
- [Workflow management](https://github.com/hubmapconsortium/airflow#readme) + [Common Workflow Language](https://github.com/hubmapconsortium/cwltool) tool
  - [Development workflow management](https://github.com/hubmapconsortium/airflow-dev#readme)

## Reference Mapping
- [Azimuth: Automated mapping of query datasets](https://github.com/satijalab/azimuth#readme) for HuBMAP references

## QA
- Approval process (currently manual process)
- [Dataset validation tools](https://github.com/hubmapconsortium/ingest-validation-tools#readme) (data, metadata)
  - [Metadata submission conversion](https://github.com/hubmapconsortium/tableschema-to-template#readme)
  - [Tests supporting validation](https://github.com/hubmapconsortium/ingest-validation-tests#readme)
- Manual curation tools
- QC metrics

## Search & Download
- General [Search](https://github.com/hubmapconsortium/search-api/blob/test-release/README.md) (Elasticsearch)
- Query tools 
- Facets
- Semantic
    - Gene
    - Cell
  - Spatial 
  - Multidimensional
- Dataset Download (Portal link + Globus mechanism)

## Visualization 
- Pipeline visualization (CWL)
- [Portal & dataset UI](https://github.com/hubmapconsortium/portal-ui#readme)
  - [Portal Styling](https://github.com/hubmapconsortium/portal-style-guide#readme)
  - [Viewer (Vitessce)](https://github.com/vitessce/vitessce#readme)
- [Spatial visualization (CCF EUI)](https://github.com/hubmapconsortium/ccf-ui#readme)
  - Cell type
  - Seq-data access (linking with dbGaP)
  - [Sample data for CCF demos](https://github.com/hubmapconsortium/ccf-ui-sampledata#readme)

## Operations
- Data Release reporting tool (internal & external facets)
- Publications (consortium website)
