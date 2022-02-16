# Datasets: Level of Access

### Status:
The status of a dataset indicates the dataset's state within the workflow process.  A typical dataset workflow process involves the following status transitions: New -> QA -> Published.  In a typical workflow, the dataset is progressing through steps representing analysis steps or increasingly stringent data quality checks.  The status also includes some non-standard statuses: Hold, Error, Processing, or Reopen.  Please note, the status of "Published" does not indicate the dataset can be seen outside of HuBMAP.  It merely means the data has undergone the necessary data curation and can be considered fit for research purposes.

### Access Level:
There are several access levels supported by HuBMAP including: protected, consortium, and public.  These levels are used by the software and API's to determine if a user has sufficient rights to see the data.  A user's access rights are determined by the information contained in a Globus token.  The levels are defined below (in order from most restrictive to least restrictive):

- protected: 
The data associated with this level contains genomic data or other data falling under HIPAA guidelines for access.  A user must formally apply for access to see this data.  Although the data labeled as protected may become known to external researchers through HuBMAP search tools, only a minimal high-level portion of the data will be accessible without a formal application.  In addition to the formal application, a user must provide a valid Globus token to access this data.

- consortium:
The data associated with this level requires the user to be a recognized member of the HuBMAP consortium.  In general, the data in the consortium data access level will eventually be made public in the future.  From a certain perspective, consortium data can be considered "embargoed" within the HuBMAP project for a certain amount of time.  A user must provide a valid Globus token to access this data.

- public:
The data associated with this level can be accessed by users outside of the HuBMAP project.  This is the least restrictive access level.  The user does not need a valid Globus token to access this data.
