# HuBMAP Infrastructure
The HuBMAP Portal is built on interoperating microservices to support collaborative development, ﬂexibility, extensibility, FAIR data, and hybrid execution using on-prem and cloud resources. The Infrastructure and Engagement Component (IEC) leads the development and implementation of HuBMAP’s core software infrastructure including data representation, management, and ingest. A microservices architecture with expressive, extensible application programming interfaces facilitates collaboration across the HIVE (HuBMAP Integration, Visualization and Engagement) and, over time, with complementary consortia such as others in the Common Fund Data Ecosystem and the Human Cell Atlas (HCA).


## Hybrid Deployment
HuBMAP is built on a hybrid on-premise (“on-prem”) and public cloud architecture (Figure 1). The on-prem cloud component provides access to unique capabilities of high performance computing (HPC) and scalable artiﬁcial intelligence (AI) at no charge and highly cost-effective data storage. The public cloud component provides high availability for core services, interoperation with certain other consortia, additional capacity, and off-site backup for maximum data resilience.

**Figure 1.**
![On-prem resources at the Pittsburgh Supercomputing Center provide cost-effective data storage and access to HPC and scalable AI at no cost. Public cloud resources host high-availability services and provide resilience, additional capacity, and interoperation with other consortia.](https://lh5.googleusercontent.com/TdWwhdNsarLTro4E5pK0YKF63sU7yLDFWoQFByuZrOoLgtmwWok9zYaxV5XoXBYrkpj16xzHJ6cM3Tzai4e6EdGse1bKLGfb_tSRjwEkQVu0xNsFhihfbk_XaVYzOEeg0cjiB9Og)

## Microservices Architecture
The HuBMAP Portal software architecture centers on microservices that communicate using RESTful application programming interfaces (APIs), as shown in Figure 2. This allows the microservices, which are designated in the following ﬁgure as components, to be independently deﬁned and implemented using potentially different technologies that are most appropriate for each microservice. This is immediately valuable for collaborative development across the HIVE, and it will facilitate federating HuBMAP data with the data of other consortia.

**Figure 2.**
![Microservice architecture for HuBMAP data ingest. Requests are issued from the Internet (globe icon) to either the Ingest UI (user interface) or the API gateways, which run on both on-prem and public cloud resources. The Ingest API, which currently runs on-prem to mount the HuBMAP File Store with maximum efficiency, is the central microservice for ingesting data and derived data into HuBMAP. It calls the UUID, Search & Index, Ontology, and Entity APIs, which together interface to graph, relational, and Elasticsearch databases. The Ingest API also executes quality control (QC) pipelines to promote high quality and usability of HuBMAP data.](https://lh6.googleusercontent.com/6W9DvwcZAh-QUyz_B7ybyT9A8TgQpHqAITQCgLT9YVRvtaAvqFo1UsMO7Nar5dI8tE-N2sLE5t02TciJc3f6Kj2eNeqqB3GaboGZwSpJ0z0WcbDgRKs4f3do9SQTm-_mjcM3dTW6)

For additional information about HuBMAP's technical infrastructure, please contact [Nick Nystrom](mailto:nystrom@psc.edu).
