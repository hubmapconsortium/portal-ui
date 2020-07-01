# HuBMAP Data & Metadata States

# Metadata

## Donor Metadata Status

|Value|Definition|
|--|--|
|0|no donor metadata provided|
|1|donor metadata provided|
|2|donor metadata curated (i.e., checked for completeness as well as validated against schema)|

## Sample Metadata Status


|Value|Definition|
|--|--|
|0|no donor sample metadata provided|
|1|sample metadata provided|
|2|sample metadata curated (i.e., checked for completeness as well as validated against schema, protocols.io, and donor and sample database)|

## Assay Metadata Status


|Value|Definition|
|--|--|
|0|no assay metadata provided|
|1|assay metadata provided|
|2|assay metadata curated (i.e., checked for completeness as well as validated against schema, protocols.io, and donor and sample database)|


# Data

## Quality Metric Availability

Indicates whether a quality metric for the data is available, irrespective of whether it was supplied by the submitter or computed by a HIVE pipeline.

|Value|Definition|
|--|--|
|0|No quality metrics are available|
|1|Quality metrics are available|

## Processing Level

Indicates how much standardized processing the data have undergone within HIVE infrastructure. This is distinct from the kinds of analyses that have been completed and distinct from the types of results (mapped reads, expression levels, cell segmentations, etc.) that are available.

|Value|Definition|
|--|--|
|0|Uploaded data. No standardized processing has been performed by the HIVE. Often this is equivalent to “raw” data, but it may include data that has been processed.|
|1|Within-dataset processing has been performed with standardized HIVE pipeline.|
|2|To be defined along with additional levels as data received.|

# Dataset

Any dataset status covers both data and metadata.

## Sign-Off Status


|Value|Definition|
|--|--|
|0|Expert has not signed off on the dataset|
|1|Expert has signed off on the dataset|


## Dataset Staging

|Value|Definition|
|--|--|
|New|Dataset definition has been created and has not yet been submitted.|
|QA|The data has been submitted, has passed automated checks and all post-processing has been completed successfully|
|Error|Data was submitted, but an error occurred during automated checks or post-processing pipelines|
|Processing|The data is currently being processed after being submitted|
|Published|The data has been published after successful automated tests, post-processing and manual curation **(sign-off status has to be 1)**|
|Invalid|Data will never be published. After manual curation it was decided that the data will not be released. **(sign-off status has to be 0)**|
|Withdrawn|Data has been withdrawn after being published. **(sign-off status has to be 1)**|
