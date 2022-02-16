# HuBMAP Documentation

<details>
<summary>HIVE Software Engineering Principles</summary>

-   Our software development teams use a multi-institutional Agile Scrum approach to create HuBMAP technologies deployed using [microservices in a hybrid cloud](https://portal.hubmapconsortium.org/docs/infrastructure). We run daily distributed stand-ups and two week sprint cycles. This enables continuous new deployments of features and enhancements under permissive open source licenses.
    
-   The HuBMAP Portal principally utilizes the following core technologies, frameworks, and languages: Globus (identity federation, data flow), Python (APIs), Javascript (UI), Neo4j (graph databases), Docker (container per micro service), and Airflow (workflows), among others. Core storage and other high performance services run locally at Pittsburgh Supercomputing Center whereas high availability services run on Amazon Web Services.
    
-   Software issues, enhancement, and feature requests are tracked using a [GitHub issues board](https://github.com/hubmapconsortium/portal-ui/issues) that is populated directly by developers and by user feedback via the help desk.
    
-   HuBMAP technology documentation resides in the [Portal documentation area](https://portal.hubmapconsortium.org/docs) as well as within [HuBMAP GitHub repositories](https://github.com/hubmapconsortium/). Other locations include our [API](https://portal.hubmapconsortium.org/docs/apis) viewable on [SmartAPI](https://smart-api.info/ui/0065e419668f3336a40d1f5ab89c6ba3). We manage our [documentation using markdown](https://github.com/hubmapconsortium/portal-docs).
    
-   HuBMAP technologies use a [microservices architecture](https://portal.hubmapconsortium.org/docs/infrastructure) and is driven by the [API Gateway](https://github.com/hubmapconsortium/gateway#readme), [Provenance services](https://github.com/hubmapconsortium/entity-api#readme), and Pipeline Container Orchestration.
    
-   We maintain dev, test, and production instances of most HuBMAP systems. In some areas we use continuous integration with [Travis CI](https://travis-ci.org/) or [GitHub CI](https://docs.github.com/en/actions/guides/about-continuous-integration).
</details>

<details>
<summary>HuBMAP Data Ingest</summary>
    
-   HuBMAP HIVE is responsible for producing and managing data ingest processes and associated software in collaboration with the Data Providers. HuBMAP Data Providers are responsible for producing data and metadata in collaboration with the HIVE. These processes are rapidly evolving into scalable pipelines.
    
-   The core ingest software and UI includes: the [Data ingest tool](https://github.com/hubmapconsortium/ingest-ui#readme) (data & metadata, sample, assay, antibody report, contributor upload), [Manual dataset ingest utilities](https://github.com/hubmapconsortium/manual-data-ingest), [Workflow management](https://github.com/hubmapconsortium/airflow#readme) + [Common Workflow Language](https://github.com/hubmapconsortium/cwltool) tool, individual data pipelines, [common coordinate framework / spatial registration via RUI](https://hubmapconsortium.github.io/ccf/), with Federated identity management and [file transfer via Globus](https://docs.globus.org/).
    
-   HuBMAP metadata is ingested into a Dockerized [Neo4j graph database for Provenance](https://github.com/hubmapconsortium/neo4j-docker#readme) as well as various function-specific relational and no-sql databases.
    
-   Data providers submit data using a combination of web registration forms, tools noted above, and registration of experimental and sample protocols at [Protocols.io](https://www.protocols.io/workspaces/human-biomolecular-atlas-program-hubmap-method-development). Metadata is submitted through the ingest process as [Tab separated value (.TSV) files](https://github.com/hubmapconsortium/ingest-validation-tools) containing sample, assay, antibody, and contributor metadata that meets HuBMAP specifications.
    
-   The [UUID API](https://github.com/hubmapconsortium/UUID-api#readme) forms the basis of ID generation. Data providers use the [Tissue & donor registration tool](https://ingest.hubmapconsortium.org/) to generate donor, organ, tissue sample (including spatial data), and dataset-specific identifiers that are interlinked and displayed on the Portal.
    
-   We accept Donor data on a HIPAA conforming Globus site and de-identify Donor data using [professional de-identification services](http://rio.pitt.edu/services) via manual abstraction from organ procurement organizations, DICOM data, electronic health record and other tabular data, as available.
    
-   Our antibody validation database and query system (pending release) includes antibody validations done by RRID by assay by organ. For individual datasets data contributors will include the RRID (and related information) for each imaging channel in antibody tab separated values files enabling linkage of submitted antibodies & their validation reports.
    
-   Each HuBMAP collection, ASCT+B table, and reference object receives its own Digital Object Identifier (DOI) using [HuBMAP’s DOI registration service](https://search.datacite.org/works?query=HuBMAP). Each dataset will have its HuBMAP DOI soon. We produce protocol DOIs via protocols.io and standard publication DOIs via [HuBMAP Publications](https://scholar.google.com/citations?user=CtGSN80AAAAJ).
    
-   The [CCF RUI (Registration User Interface)](https://hubmapconsortium.github.io/ccf-ui/rui/) is a tool that supports the registration of a three-dimensional (3D) tissue block within a 3D reference organ. The registration data is used in current versions of the Common Coordinate Framework (CCF, see [CCF RUI SOP](https://docs.google.com/document/d/11jKl__ltdDO3PBMHgHpZnIcZTNuxGUpX_94l6CtTP2I/edit?usp=sharing), [CCF RUI GitHub repository](https://github.com/hubmapconsortium/ccf-ui), [RUI Demo](https://www.youtube.com/watch?v=142hGer4xvU)) and the CCF Exploration User Interface (EUI) developed within HuBMAP. The RUI currently supports 11 organs, written in TypeScript using libraries such as: Angular 11, Deck.gl, NGXS, Angular Material, and N3.js.
    

-   We will also associate ontologies for [reference organs, anatomical structures, cell types, and biomarkers](https://hubmapconsortium.github.io/ccf/) using [CCF reference objects](https://github.com/hubmapconsortium/ccf-3d-reference-object-library#readme), [ASCT+B tables](https://hubmapconsortium.github.io/ccf-asct-reporter/), and [Azimuth reference objects](https://azimuth.hubmapconsortium.org/) with the data ingest items.
</details>

<details>
<summary>HuBMAP Data Validation</summary>

-   HuBMAP Data Validation is a continuously improving process that starts with defining QC/QA standards and establishing definitions for donor, sample and assay metadata.
Standards, definitions, metadata schema and data directory schema are created by teams under the Data Coordination Working Group.
Metadata schemas are available [here](https://hubmapconsortium.github.io/ingest-validation-tools/),
along with Excel templates with dropdowns for data entry.

    
-   Data providers format their data and metadata files according to the metadata and data directory schema specifications for each assay type. Required formats for metadata field input are described in the [Github page for each assay-specific metadata schema](https://hubmapconsortium.github.io/ingest-validation-tools/). Data providers also include the required QA/QC assessments of their data as components of the submission.

    
-   Data providers receive registration and validation guidance using [HuBMAP’s data submission guide (currently v1.0)](https://docs.google.com/document/d/1KR2TC2y-NIjbBRHTu0giSZATMUfPKxN_/edit) as well as [Ingest tool documentation](https://github.com/hubmapconsortium/ingest-validation-tools).
    
-   [HuBMAP validation tools](https://github.com/hubmapconsortium/ingest-validation-tools#readme) written in Python ensure data submissions conform to HuBMAP standards which are shared and documented for data providers to use to run many of HuBMAP’s checks on their own prior to submission. Other services include [Metadata submission conversion](https://github.com/hubmapconsortium/tableschema-to-template#readme), [ingest validation](https://github.com/hubmapconsortium/ingest-validation-tests#readme) and base checks (checksum, file type, etc.) as well as [assay-specific checks](https://portal.hubmapconsortium.org/docs/assays).
    
-   HuBMAP staff conduct 178 (and growing) automated and manual QA/QC checks as part of the data submission & publication process. Manual validation steps are being automated as development capacity allows.
    
-   Prior to publication, each dataset is formally approved by the data-providing institution and one or more HIVE members. Data providers must also confirm the quality of spatial and semantic metadata using the [CCF EUI](https://portal.hubmapconsortium.org/ccf-eui).
</details>

<details>
<summary>HIVE Data Processing</summary>
    
-   The following HuBMAP [pipelines](https://portal.hubmapconsortium.org/docs/pipelines) are run by the HIVE on data from the Data Providers with their assent to gain maximum consistency and usability of final published datasets produced by HuBMAP: [CODEX (Cytokit + SPRM)](https://github.com/hubmapconsortium/codex-pipeline#readme), [“Example Pipeline”](https://github.com/hubmapconsortium/example-pipeline), [Imaging Mass Spectrometry & MxIF](https://github.com/hubmapconsortium/ims-mxif-pipeline#readme), [sc/snATAC-seq](https://github.com/hubmapconsortium/sc-atac-seq-pipeline#readme) (SnapTools, SnapATAC, and chromVAR), [sc/snRNA-seq](https://github.com/hubmapconsortium/salmon-rnaseq/blob/master/README.rst) (Salmon, Scanpy, scVelo), [SPRM](https://github.com/hubmapconsortium/sprm#readme) (Imaging pipeline), Spatial Transcriptomics (Starfish).
    
-   Pipelines are Dockerized by HIVE or data providers and verified by HIVE and integrated with the other portal components, including these general pipeline tools:[Data ingest pipeline](https://github.com/hubmapconsortium/ingest-pipeline#readme), [Mixed datatype pipeline tools](https://github.com/hubmapconsortium/cross-dataset-common#readme), [OME.TIFF Pyramid](https://github.com/hubmapconsortium/ome-tiff-pyramid), Pipeline visualization (CWL), [Pipeline deployment](https://github.com/hubmapconsortium/pipeline-release-mgmt/blob/master/README.rst). These are run by the HIVE in the process of generating datasets for publication.
    
-   The HuBMAP pipelines generate these data types via these tools: [Sequencing (FASTQ) file tools](https://github.com/hubmapconsortium/fastq-utils), [Sequencing (snap) file tools](https://github.com/hubmapconsortium/SnapTools/blob/hubmap-develop/README.md), [Visualization pre-processing](https://github.com/hubmapconsortium/portal-containers#readme), [Vitessce pre-processing](https://github.com/hubmapconsortium/vitessce-data#readme), [Base QA pipeline](https://github.com/hubmapconsortium/ingest-pipeline). QA metrics service (assay specific pipeline QA metric sharing).
    
-   Each of the pipelines produce data and metadata back to the ingest services to enable management of publication status and controlled access of metadata and datasets. Datasets, once approved, are pushed to published and public status, using custom code which changes the status to public of upstream Provenance entities (e.g., samples, donors) and downstream files (e.g., movement of data to Globus public access endpoints if not protected sequence data).
    
-   We currently manually capture dataset submission & publication efforts including active datasets’ status, target month of publication, and future datasets. We comprehensively track donor, sample, dataset, spatial, pipeline, visualization, antibody, security (identifiably sequencing), protocol, documentation, metadata & QA/QC standards compliance, and data contributors.
    
-   Internally, we regularly update data into a spreadsheet and use our Sankey diagram tool to view HuBMAP’s current and planned state of dataset publication (Figure).
![](https://lh3.googleusercontent.com/qOmRDIj90de1iOHal4-xpdaowe-CF8DjwGIHBihdyTsvI0gVO9gw1kHJpw7TymGV_zKyS9yuzHe1u0aP_4eaHbMY0dR--U1hQBmHKQEJC64LeudJogRcy8xcqdQRRsft9g)
</details>


<details>
<summary>HuBMAP Data Portal</summary>
    
-   [The HuBMAP Data Portal UI](https://github.com/hubmapconsortium/portal-ui#readme) is principally a Flask app, using React on the front end and primarily Elasticsearch on the back end, wrapped in a Docker container for deployment using Docker Compose. It is deployed at portal.hubmapconsortium.org. Scientists access summary data, visualizations, and data downloads by dataset on the Portal. Globus facilitates file transfer for local use of data.
    
-   The HuBMAP [Portal Style Guide](https://github.com/hubmapconsortium/portal-style-guide#readme) is used for the Data Portal and other HuBMAP sites.
    

-   While HuBMAP published datasets are openly accessible, HuBMAP consortium level access is managed via the HuBMAP profile system and uses Globus authentication for credential checking.
    

-   [The Vitessce Viewer](https://github.com/vitessce/vitessce#readme) is a visual integration tool for exploration of spatial single cell experiments. Its modular design is optimized for scalable, linked visualizations that support the spatial and non-spatial representation of tissue-, cell- and molecule-level data. Vitessce integrates the Viv library to visualize highly multiplexed, high-resolution, high-bit depth image data directly from OME-TIFF files and Bio-Formats-compatible Zarr stores.
    
-   Multiple opportunities to query the data use these mechanisms: General [Search](https://github.com/hubmapconsortium/search-api/blob/test-release/README.md) (Elasticsearch), Query tools and Facets (integrated in UI), and Semantic query (not yet available to Portal users) including by Gene, Cell, Spatial, and Multidimensional; while the [CCF EUI](https://github.com/hubmapconsortium/ccf-ui#readme) provides a detailed look at different parts of the human body, including the heart, kidney, and spleen and spatial data query.
    
-   HuBMAP’s APIs support registration and loading of data that complies with HuBMAP data standards and ingest formats as well as core functions underpinning the Portal UI itself. [Data Search](https://github.com/hubmapconsortium/search-api/) - Search API is a thin wrapper of the Elasticsearch. It handles data indexing and reindexing into the backend Elasticsearch. [Identity system](https://github.com/hubmapconsortium/uuid-api/blob/test-release/README.md) - The uuid-api service is a restful web service used to create and query UUIDs used across HuBMAP.
    

-   The HuBMAP Portal provides access to cutting-edge tools to help analyze the data such as the [ASCT+B Reporter](https://github.com/hubmapconsortium/ccf-asct-reporter#readme) - includes a partonomy tree that presents relationships between various anatomical structures and substructures, that is combined with their respective cell types and biomarkers via a bimodal network - and [Azimuth](https://github.com/satijalab/azimuth#readme) - is a Shiny app demonstrating a query-reference mapping algorithm for single-cell data - and the Cells API: [backend](https://github.com/hubmapconsortium/cross_modality_query#readme), [js client](https://github.com/hubmapconsortium/hubmap-api-js-client#readme), [py client](https://github.com/hubmapconsortium/hubmap-api-py-client#readme) - with other tolls coming such as the [Knowledge Graph](https://github.com/hubmapconsortium/ontology-api#readme) and associated [Schema](https://github.com/dbmi-pitt/UMLS-Graph#readme) for Ontology ingest & API services and application and biomedical ontologies
    

-   The HIVE monitors HuBMAP portal activity including usage, download, and limited demographic factors using [Monitoring services](https://datastudio.google.com/u/0/reporting/03a48766-c00a-4909-8790-03caf3292010/page/FltfB?s=vJoh994ntRw). Current State [FAIRness Assessment](https://docs.google.com/document/d/1fc3r3JGiXmg3If7aYV_K5BQTVa-yY0U3tAggBknkw_Q/edit?usp=sharing).
</details>

<details>
<summary>HuBMAP Governance & Due Diligence</summary>
    
-   [HuBMAP consortium policies](https://hubmapconsortium.org/policies/) are located on the consortium website and cover associate membership, consent, data sharing, data use, material transfer, publication, and NIH-applicable [Genomic Data Sharing with HuBMAP data](https://portal.hubmapconsortium.org/docs/consent).
    
-   We use [three categories of permissions](https://portal.hubmapconsortium.org/docs/datasets) for securing access to HuBMAP data: protected, consortium, and public
    
-   Consortium-level access is driven from an integrated  [user registration](https://github.com/hubmapconsortium/member-ui#readme) tool that collects and associates credentials among Members’ institutions, Globus file transfer service, GitHub code repositories, Google Drive document storage, and other services presented via the WordPress based HuBMAP consortium website.
    
-   Any identifiable sequencing data is accessible via dbGaP within 6 months of initial publication on the HuBMAP portal in order to ensure secure access to this sensitive data -- for details, see the [Sequencing data dbGaP submission tool](https://github.com/hubmapconsortium/dbgap-submission-scripts#readme)
    
-   Data providers and the HIVE are responsible for secure loading and storage of identifiable sequencing data -- generally, the data providers manage administrative interaction with dbGaP and the HIVE (IEC) manages technical interaction & data loading of identifiable sequencing datasets.
    

-   We also automatically collect and display [HuBMAP-generated and referenced publications](https://scholar.google.com/citations?user=CtGSN80AAAAJ&hl=en) using Google Scholar.
</details>
