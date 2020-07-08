# donor

## Table of contents
<details><summary>Background</summary>

[`data_acquisition`](#data_acquisition)<br>
[`data_transformation`](#data_transformation)<br>
</details>

<details><summary>Format</summary>

[`donor_id`](#donor_id)<br>
[`source_name`](#source_name)<br>
[`start_datetime`](#start_datetime)<br>
[`end_datetime`](#end_datetime)<br>
[`graph_version`](#graph_version)<br>
[`concept_id`](#concept_id)<br>
[`code`](#code)<br>
[`sab`](#sab)<br>
[`data_type`](#data_type)<br>
[`data_value`](#data_value)<br>
[`numeric_operator`](#numeric_operator)<br>
[`units`](#units)<br>
[`preferred_term`](#preferred_term)<br>
[`grouping_concept`](#grouping_concept)<br>
[`grouping_concept_preferred_term`](#grouping_concept_preferred_term)<br>
[`grouping_code`](#grouping_code)<br>
[`grouping_sab`](#grouping_sab)<br>
</details>

<details><summary>Content</summary>

[`basic_demographics`](#basic_demographics)<br>
[`more`](#more)<br>
</details>

## Background

### `data_acquisition`
Donor metadata is supplied from each data generating site as either a PDF supplied by the organ procurement organization (OPO) or a downloaded and then de-identified extract from the United Network for Organ Sharing (UNOS) system or as csv files with available data (generally live surgical donors).

### `data_transformation`
Donor metadata is manual-abstracted into the format described in this document into a single spreadsheet using Microsoft Excel, then exported as CSV, and finally ingested into the HuBMAP Provenance Graph as donor metadata associated with the applicable HuBMAP Donor Entity. Assignment of Concepts, Codes, and Terms in the manual-abstraction follows the principles of using Unified Medical Language System (UMLS) Concepts which are common to multiple vocabularies when possible and favoring the use of SNOMEDCT_US. Donor-level data in the first release are limited to those that appear once per donor (e.g. demographics, but not vital signs or lab tests that repeat). The generally common donor-level data across OPOs was abstracted in the first release as the donor metadata. 

## Format

### `donor_id`
This is the HuBMAP ID of the donor (e.g. HBM579.RPKF.738)

| constraint | value |
| --- | --- |
| required | `True` |

### `source_name`
What type of data source this data comes from.

| constraint | value |
| --- | --- |
| required | `True` |
| enum | `organ_donor_data` |

### `start_datetime`
This is the approximate time difference in seconds between the procurement and the start of this event (this is to construct time series records of clinical data for event-level data not donor-level data). This is zero or blank in all data in first release.

| constraint | value |
| --- | --- |
| type | `number` |
| required | `False` |

### `end_datetime`
This is the approximate time difference in seconds between the procurement and the end of this event (this is to construct time series records of clinical data for event-level data not donor-level data). This is zero or blank in all data in first release.

| constraint | value |
| --- | --- |
| type | `number` |
| required | `False` |

### `graph_version`
This is the version of the HuBMAP Knowledge Graph that the Concept appears in (not limited to UMLS-Graph in future but only UMLS2019AA in first release).

| constraint | value |
| --- | --- |
| required | `True` |
| enum | `UMLS2019AA` |

### `concept_id`
This is the Concept ID from the HuBMAP Knowledge Graph (not limited to UMLS Concepts in future but only UMLS Concepts in first release).

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

### `code`
This is a Code from a source vocabulary in the HuBMAP Knowledge Graph (not limited to UMLS vocabulary codes in future but only UMLS source vocabulary codes in first release).

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

### `sab`
This is the source vocabulary in the HuBMAP Knowledge Graph (not limited to UMLS vocabularies in future but only UMLS source vocabularies in first release).

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

### `data_type`
This is the data type of this record. Numeric types will generally have non-null data_value. Nominal types will generally have null data_value.

| constraint | value |
| --- | --- |
| required | `True` |
| enum | `Nominal` ,`Numeric` |

### `data_value`
This is the data value of this record. 

| constraint | value |
| --- | --- |
| required | `False` |
| type | `number` |

### `numeric_operator`
This is the numeric operator for the data value. This enables inputing thresholds and ranges for data values by using greater than or less than.

| constraint | value |
| --- | --- |
| required | `False` |
| enum | `EQ`,`GT`,`LT` |

### `units`
This are the units for the data value.

| constraint | value |
| --- | --- |
| required | `False` |
| type | `string` |

### `preferred_term`
This is the preferred display term for this item for faceted search in the portal. It may or may not correspond to a term in UMLS for this concept.

| constraint | value |
| --- | --- |
| required | `False` |
| type | `string` |

### `grouping_concept`
This is the Concept ID from the HuBMAP Knowledge Graph (not limited to UMLS Concepts in future but only UMLS Concepts in first release) that is to be used for grouping this record for faceted search in the portal.

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

### `grouping_concept_preferred_term`
This is the preferred display term for the facet in which this record should be counted for faceted search in the portal. It may or may not correspond to a term in UMLS for the grouping concept.

| constraint | value |
| --- | --- |
| required | `False` |
| type | `string` |

### `grouping_code`
This is a Code from a source vocabulary in the HuBMAP Knowledge Graph (not limited to UMLS vocabulary codes in future but only UMLS source vocabulary codes in first release). This code corresponds to the grouping_concept.

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

### `grouping_sab`
This is the source vocabulary in the HuBMAP Knowledge Graph (not limited to UMLS vocabularies in future but only UMLS source vocabularies in first release). This sab corresponds to the grouping_code.

| constraint | value |
| --- | --- |
| required | `True` |
| type | `string` |

## Content

### `basic_demographics`
Examples.

| donor_id | source_name | start_datetime | end_datetime | graph_version | concept_id | code | sab | data_type | data_value | numeric_operator | units | preferred_term | grouping_concept | grouping_concept_preferred_term | grouping_code | grouping_sab |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | organ_donor_data | | | UMLS2019AA | C3839079 | 703117000 | SNOMEDCT_US | Nominal | | | | Male | C1287419 | Gender | 365873007 | SNOMEDCT_US |
| | organ_donor_data | | | UMLS2019AA | C3839293 | 703118005 | SNOMEDCT_US | Nominal | | | | Female | C1287419 | Gender | 365873007 | SNOMEDCT_US |
| | organ_donor_data | | | UMLS2019AA | C0001779 | 424144002 | SNOMEDCT_US | Numeric | 44 | EQ | years | Age | C0001779 | Age | 424144002 | SNOMEDCT_US |
| | organ_donor_data | | | UMLS2019AA | C1305855 | 60621009 | SNOMEDCT_US | Numeric | 25.869 | EQ | kg/m^2 | Body mass index | C1305855 | Body mass index | 60621009 | SNOMEDCT_US |
| | organ_donor_data | | | UMLS2019AA | C0027567 | 413464008 | SNOMEDCT_US | Nominal |  |  |  | Black | C0034510 | Race | 415229000 | SNOMEDCT_US |
| | organ_donor_data | | | UMLS2019AA | C0007457 | 413773004 | SNOMEDCT_US | Nominal |  |  |  | White | C0034510 | Race | 415229000 | SNOMEDCT_US |

### `more`
There are additional concepts to be added to the data and documented here.
