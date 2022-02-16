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

| Pref_Term | CUI | CodeID | Term | Display_pref_term
| --- | --- | --- | --- | --- |
| Age | C0001779 | SNOMEDCT_US 424144002 | Current chronological age (observable entity) | Age |
| Body mass index | C1305855 | SNOMEDCT_US 60621009 | Body mass index (observable entity) | Body mass index |
| sex | C1522384 | SNOMEDCT_US 57312000 | Sex structure (body structure) | Sex |
| Females | C0086287 | SNOMEDCT_US 1086007 | Female structure (body strucutre) | Female |
| Males | C0086582 | SNOMEDCT_US 10052007 | Male structure | Male |
| Racial group | C0034510 | SNOMEDCT_US 415229000 | Racial group (racial group) | Race |
| African race | C0027567 | SNOMEDCT_US 413464008 | African race (racial group) | Black or African |
| Caucaoid Race | C0007457 | SNOMEDCT_US 413773004 | Caucasian (racial group) | White |
| Blood typing procedure | C0005844 | SNOMEDCT_US 44608003 | Blood group typing (procedure) | Blood type |
| Blood group A (finding) | C0427620 | SNOMEDCT_US 112144000 | Blood group A (finding) | A |
| Blood group AB | C0427624 | SNOMEDCT_US 165743006 | Blood group AB (finding) | AB |
| Blood group B (finding) | C0427623 | SNOMEDCT_US 112149005 | Blood group B (finding)) | B |
| Blood group O (finding) | C0427625 | SNOMEDCT_US 58460004 | Blood group O (finding) | O |
| Rh blood group typing procedure | C0430279 | SNOMEDCT_US 363783003 | CRh blood group typing (procedure) | Rh factor |
| RhD negative | C4551754 | SNOMEDCT_US 165746003 | RhD negative (fiding) | Negative |
| RhD positive  | C4551753 | SNOMEDCT_US 165747007 | RhD positive (fiding) | Positive |
| Body Height | C0005890 | SNOMEDCT_US 50373000 | Body height measure (observable entity) | Height |
| Body Weight | C0005910 | SNOMEDCT_US 27113001 | Body weight (observable entity) | Weight |
| Kidney Donor Profile Index Clinical Classification  | C4330523 | NCI C130310 | Kidney Donor Profile Index Clinical Classification) | Kidney donor profile index |
| Cause of Death | C0007465 | SNOMEDCT_US 184305005 | Cause of death (observable entity) | Cause of death |
| Mechanism of injury | C0449413 | SNOMEDCT_US 246078001 | Mechanism of injury (attribute) | Mechanism of injury |
| Cessation of life | C0011065 | SNOMEDCT_US 419620001 | Death (event) | Death |
| Natural death | C0277610 | SNOMEDCT_US 38605008 | Natural death (event) | Natural causes |
| Cardiac Arrest | C0018790 | SNOMEDCT_US 410429000 | Cardiac arrest (disorder)| Cardiac arrest |
| Medical History | C0262926 | SNOMEDCT_US 392521001 | History of (contextual qualifier) | Medical history |
| Social and personal history | C0424945 | SNOMEDCT_US 160476009 | Social / personal history observable (observable entity) | Social history |
| Diabetes Mellitus | C0011849 | SNOMEDCT_US 73211009 | Diabetes mellitus (disorder)| Diabetes |
|  Malignant Neoplasms | C0006826 | SNOMEDCT_US 363346000 | Malignant neoplastic disease (disorder) | Cancer |
| Hypertensiv disease | C0020538 | SNOMEDCT_US 38341003 | Hypertensive disorder, systemic arterial (disorder)  | Hypertension |
| Coronary Artery Disease | C1956346 | SNOMEDCT_US 53741008 | Coronary arteriosclerosis (disorder) | Coronary artery disease |
| Gastrointestinal Diseases | C0017178 | SNOMEDCT_US 53619000 | CDisorder of digestive system (disorder) | Gastorintestina disease |
| Thoracic Injuries | C0039980 | SNOMEDCT_US 262525000 | Chest injury (disorder) | Chest trauma |
| Smoker | C0337664 | SNOMEDCT_US 77176002 | Smoker (finding) | Smoker |
| Alcoholic Intoxication | C0001969 | SNOMEDCT_US 25702006 | Alcohol intoxication (disorder) | Heavy drinker |
| Intravenous drug user | C0242566 | SNOMEDCT_US 228388006 | Intravenous drug user (finding)) | Intravenous drug user |
| Cerebrovascular accident | C0038454 | SNOMEDCT_US 230690007 | Cerebrovascular accident (disorder) | Cerebrovascular accident |
| Intracranial Hemorrhage | C0151699 | SNOMEDCT_US 1386000 | Intracranial hemorrhage (disorder) | Intracranial hemorrhage |
| Anoxia | C0003130 | SNOMEDCT_US 29658002 | Oxygen supply absent (finding) | Anoxia |
| Asphyxia | C0004044 | SNOMEDCT_US 66466001 | Asphyxiation (event) | Asphyxiation |
| Addisonian crisis | C0151467 | SNOMEDCT_US 766986002 | Acute adrenal insufficiency (disorder) | Addisonian crisis |
| Drug toxicity | C0013221 | SNOMEDCT_US 7895008 | Poisoning caused by drug AND/OR medicinal substance| Drug intoxication |
| Exposure to inanimate mechanical force | C0337242 | SNOMEDCT_US 88817006 | Exposure to inanimate mechanical force (event) | Accident |
| Suicide | C0038661 | SNOMEDCT_US 44301001 | Suicide (event) | Suicide |
| Craniocerebral Trauma | C0018674 | SNOMEDCT_US 82271004 | Injury of head (disorder) | Head trauma |
| Nonpenetrating Wounds | C0043253 | SNOMEDCT_US 425359009 | Blunt injury (disorder) | Blunt injury |
| Motor vehicle accident | C2939181| SNOMEDCT_US 418399005 | Motor vehicle accident (event) | Motor vehicle accident |
