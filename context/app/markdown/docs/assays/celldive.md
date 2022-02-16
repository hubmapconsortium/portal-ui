# HuBMAP Cell DIVE Data (GE Research)

## Last Updated: 12/18/2020

This document details Cell DIVE data states, metadata fields, file structure, QA/QC thresholds, and data processing.

## Description: 
Cell DIVE multiplexed imaging is an antibody-based hyperplexed technique for studying spatial cell biology. In brief, the process consists of iterative cycles of staining with fluorescently-labeled antibodies, imaging, and dye inactivation. Automated image processing algorithms for image correction, background fluorescence subtraction, and registration of all multiplexed images allows for expression analysis of more than 60 proteins in a single tissue section at cellular/subcellular levels.

## Definitions: 
There are a variety of terms used in this document that may not be familiar to all HubMap users. The following figures illustrate several of these terms: 

![](https://lh5.googleusercontent.com/IUV_tmeyHIEBNrkwXEOK-HrAuMbpblohZOH_milqDyCgOvnr29AdsYZFvKJxBQxskplL2gjAjcZejwaZKS6TVfaXQlqCG6o0OwIuwN5hg_tU2PyDy7sqUwmNvWBEdU1N_1MzgyiyWXU0Vn2V)

**Figure 1:** *Diagram of microscopy terms. The black box represents a slide or cover slip holding the sample. Blue boxes represent “regions” or user-defined imaging areas. For instance, one selects a “region” containing a microstructure of interest to be captured in an image. Red boxes represent “tiles” or the microscope “field of view”. The size of a tile is determined by the microscope settings and objective. An imaging region is divided into contiguous tiles. Because the field of view cannot be changed, tiles will overhang from the region, ensuring the entire region is imaged at the expense of extra tiles being acquired.*

![](https://lh6.googleusercontent.com/tygqsED6l7B6SPzOe6_z37HWMO0oCbZs04Rtuu9EjWjQohQoqZyd7gZVJDgP0lg9ooqUOtTdWM-RuGz8kLi1MVIVCyg2oHzcEAugNtnxe8DsWVt_Eo9JOPLodMHIvBD_celucSqfNOBC6Ilt)

**Figure 2:** *Images are generally acquired with adjacent tiles overlapping, as indicated by the dark regions in the image on the right above. Overlap enhances alignment of tiles for stitching to create a composite image, as shown in Figure 4 below.*

![](https://lh4.googleusercontent.com/NOgYrh0KpVPjuosfJgeeqlrUxDpAf88stJ6vpN-Vi6RHq7gZec7SfPlktnz2gMCw_a5ic1ISv2HaVtEIMFZ2Rp9IQEgkEIV1I3y1vTX-GsTKtBU3N2JYp88f7IvXzb1O63K2LxKcieRUp77v)

**Figure 3:** *Images of tiles are captured as the stage moves across the imaged region row by row (left) or via a serpentine (or snake-like) path (right).*

![](https://lh4.googleusercontent.com/Oy7KfVL4J-sK2_FaYl3j_4TTCwk04ZN0FAhUYJYdrGROp6SIRHMw_BUHdyOba3qih8NapQSI8TJa3QmUJn9odg3UuDz_Q0ilx-1kHP12UyC-K0f3qlj8yG0RxmAKFnMEpfqC7ZJy3nwFOY3U)

**Figure 4:** *Stitching is the process of aligning and merging neighboring image tiles into a single composite image.*

![](https://lh5.googleusercontent.com/qQdIuw7mb-7UqwuGG26AvXOayPNI7EUpMHIbhD2Jt3NpffgftKAEeybUZJvxDZd_g6MS37H1yjB4zo5ouA9TNIAhh_iJrM_Ars3wXJnsmQZUay53n4ZdikITCGhOMLJ8dE-j9tdjagjCUkwI)

**Figure 5:** *Deep learning based nuclei segmentation. An encoder-decoder based deep learning model was used for nuclei segmentation. Multiscale Laplacian of Gaussian (LoG) as feature map was derived from DAPI images was used for training the encoder-decoder deep learning framework of three levels. Max pooling was applied at all the levels for relevant feature selection in the encoding phase and drop-out was used to reduce over fitting.*

## Terms defined in this document:
|**Term** |  **Definition**|
|--|--|
|  Intensity| Detector Counts| 
|  Signal| Intensity produced by fluorescence, both endogenous and introduced| 
|  Noise| Intensity not produced by light but electronic fluctuations or electronic background.| 
|  Stitching| Image stitching is the process of combining multiple images (tiles) with overlapping fields of view to produce a single, large image.| 
|  Alignment/Registration| Image registration is the process of transforming different images into one coordinate system. Registration of all channels in each cycle is performed.| 
|  Dedistortion| Dedistortion refers to reversing the optical distortion that takes place in an optical microscope to sharpen images/ improve definition. Practically, a calibration plate with appropriate artifacts is used to determine optical distortion coefficients that are then applied as per the model. |
|  Channels| Name of the fluorescence excitation wavelengths used. May be expressed as a fluorophore name (e.g. DAPI, GFP, DsRED, Cy5), wavelength (e.g. 488, 540, 750)
|  Cycles| A process of adding a round of fluorescently-labeled antibodies, imaging, and dye inactivation.| 
|  Regions| User defined imaging area.| 
|  Cell DIVE| Diversity, Imaging, Variation, Expression  | 
|  Autofluorescence/Background| Endogenous fluorescence signal.| 
|  Fluorescence | Light produced by a fluorophore that is bound to an antibody.|
|  X plane| Plane that determines width| 
|  Y plane| Plane that determines height| 
|  Z plane| Plane that determines depth| 
|  Pixel size| Defines size of pixel on the camera (square)| 
|  Tile| Rectangular field-of-view (Figure 1).| 
|  Field of View| Available imaging area without stage movement. | 
|  Autofluorescence/ Background Subtraction| Subtraction of autofluorescence intensity from total intensity| 

## HuBMAP Cell DIVE Data States (Levels):
The HuBMAP project provides...

|**Data State** |  **Description**| **Example File Type** | 
|--|--|--|
|  0 | Raw image data: This is the data that comes directly off the microscope without preprocessing; sometimes referred to as tiled or unstitched data. (may not always be included).| TIFF|
| 1 |  Processed Microscopy data: Can include stitching, thresholding, background subtraction, de-distortion |  TIFF, OME-TIFF|
| 2 |  Segmentation: Computationally predicted cell (nucleus, cytoplasm) and/or structural boundaries (tubules, ventricles, etc.) |  CSV, TIFF|
| 3 |  Annotation (Cells and Structures): Interpretation of microscopy image and/or segmentation in terms of biology (e.g. unhealthy vs healthy, cell-type, function, functional region). (May not always be included.) |  TIFF, XML|

## HuBMAP Metadata
All HuBMAP Cell DIVE data will have searchable metadata fields.
This metadata field schema resides in Github where it can be viewed and downloaded. Any further changes must now be implemented by filing a [Github](https://github.com/hubmapconsortium/ingest-validation-tools/tree/master/docs/celldive) issue for Chuck McCallum.

## Associated Metadata Content:
The Table below describes the Level 2 metadata fields that are included in the CELLDIVE_metadata_TEMPLATE file.
|**Field** |  **Description**|
|--|--|
|  number of antibodies| total number of antibodies applied to the tissue| 
|  number of channels| Number of imaging channels used| 
|  number of cycles| Number of complete image/stain/image/bleach cycles performed| 
|  number of imaging rounds| Number of separate image rounds conducted| 
|  resolution_x_unit| unit of measure for image resolution about x axis| 
|  resolution_x_value|actual resolution for x axis| 
|  resoltuon_y_unit| unit of measure for image resolution about y axis| 
|  resolution_y_value| actual resolution for y axis| 
|  processing_protcols_io_doi| link to processing protocols|
|  overall_protocols_io_doi| link to overall protocols|

The following metadata fields reside in the appropriate round_info_SXXXXXXXX_RRR.dat, where SXXXXXXXXX is the slide number and RRR refers to the round.  This data is not all included in the CellDIVE_metadata_TEMPLATE and is not intended for inclusion on the web based interface, but since they do appear in the included round_info files we include descriptions here for reference.
|**Field** |  **Example**| **Definition**|
|--|--|--|
|  sw_version| NA | deprecated|
|  round_num| 2 |Current imaging round (starts at 1) |
|  round_name| bkgnd_dapi_bkgnd_fitc_bkgnd_cy3_bkgnd_cy5 | Name of the current round.  If a stained round will include the various stain names|
|  autofocus| TRUE |Is autofocus turned on |
|  focus_chan| dapi |What imaging channel is used for focusin |
|  round_type| bkgnd |If images are <background> (i.e. unstained), <bleached> (unstained with chemical dye inactivation), or <stained> (markers applied)  |
|  operator| 200020245 | Interal ID number of operator|
|  study_num| NA | tracking number asigned to the study|
|  ab_name| NA |depracated field |
|  extend_avg| FALSE |Is image averaging turned on |
|  num_avg| 1 |If averaging is turned on, how many images participate in the average |
|  auto_align| TRUE | Is autoalignment turned on (i.e. transform FOV locations based in measured shift between the current round and the auto-alignment round)|
|  align_chan| dapi | what channel is to be used for auto-alignment|
|  align_exp| 50 |what exposure is used for auto-alignment |
|  align_round| 1 |The round to which auto-align is being performed |
|  align_nfov| 5 |The number of fields used for the auto-alignment |
|  align_stdres| 0.002136 | The standard residual error in the fit to determine the transformation matrix between the current round and the auto-align round|
|  microscope_id| mk01002 |ID of the microscope used to perform imaging |
|  cal_plate_serial| 0 |deprecated |
|  intens_cal_version|  |deprecated |
|  cal_check_date| 2020-03-11T09h02m09s |date of calibration |
|  cam_pix_size_x| 6.5 |camera pixel size in x dimension in microns |
|  cam_pix_size_y| 6.5 |camera pixel size in y dimension in microns|
|  cam_pix_x| 2040 |number of pixels in camera in x |
|  cam_pix_y| 2040 |number of pixels in camera in y |
|  cam_bin| 1 |binning factor used for images |
|  scanplan_bin| 8 |binning factor used for scanplanning (initial acquisition of lower mag whole slide image) |
|  sw_version|  | deprecated|
|  cam_rotation| 0 |angle (in degrees) of rotation applied to acquired images |
|  version_info| [4009:4011M][https://openge.ge.com/svn/asist/trunk][200015410] |SVN repository tag |
|  baseline_round| 2 |round number against which all current tiles are registered |
|  baseline_focus| FALSE |Is focus position of initial round used as base focus for current round? |
|  date_started| 2020-04-01T20:45:55 | start date of acquisition|
|  Objective_Mag| 20 | magnification of objective used for acquisition|
|  Objective_NA| 0.75 |numerical aperature of objective used for acquisition |
|  Objective_Name| 20x_high_na |name of the objective used for acquisition |
|  Objective_orientation| cover | <cover> means imaging is performed through the coverslip, <slide> means imaging is performed through the slide|
|  holder_name| INCell Prior 2 slide cdown |name of the holder being used with the slides |
|  holder_pos| 1 |position in the holder for the slide being images |
|  holder_serial| 3018 |serial number of the holder being used for holding the slides |
|  optimized_imaging| 1 | <1> means asynchronous imaging mode is used, <0> means it is not|
|  barcode_set| TRUE | Is barcode in use?|
|  barcode_pic_present| TRUE |Is barcode reader capturing an image of the barcode? |
|  theta_x| -0.000325 |tilt of the slide about the X axis (in radians) |
|  theta_y| 0.00042 | tilt of the slide about the Y axis (in radians|
|  tilt| OK | Status of tilt check|
|  flattened| TRUE |Is illumination flattening applied to all tiles |
|  stitch_planned| TRUE |Are tiles set for stitching |
|  lamp_age| 0 | deprecated|
|  protocol_id| 1000 |deprecated |
|  protocol_step_id| 0 |deprecated |
|  protocol_name| auto_generated |deprecated |
|  h_and_e| 1 |is a virtual H&E image to be generated? |
|  h_chan| dapi | Fluorescent channel to be used for hematoxylin|
|  e_chan| cy3 | Fluorescent channel to be used for eosin|
|  overexposure_protection| FALSE | Is overexposure protection turned on|
|  channel_1| dapi |channel_<n> to be images |
|  exp_time_1| 50 | exposure time of channel <n>|
|  exp_counts_1| 169425.625 |imager independent scaled exposure time for channel <n> |
|  stain_name_1| bkgnd | name of stain for channel <n>|
|  af_removal_round_1| -1 | channel to be used for AF removal for this stain (-1 means do not perform AF removal)|
|  cal_cps_1| 3388512.5 |channel specific calibration factor for channel <n> |
|  cal_scale_1| 1 | channel specific calibration scale factor for channel <n>|
|  zstack_num_steps_1| 1 | number of images in z stack for channel <n>|
|  zstack_step_size_1| 50 |step size for zstack in um for channel <n> |
|  background_name_1| back_dapi.tif | fixed image to subtract for channel <n>|
|  background_exp_1| 2000 |exposure time for fixed image to be subtracted for channel <n> |
|  channel_2| fitc |channel_<n> to be images |
|  exp_time_2| 100 |exposure time of channel <n> |
|  exp_counts_2| 46968.6625 |imager independent scaled exposure time for channel <n> |
|  stain_name_2| bkgnd |name of stain for channel <n> |
|  af_removal_round_2| -1 | channel to be used for AF removal for this stain (-1 means do not perform AF removal)|
|  cal_cps_2| 469686.625 |channel specific calibration factor for channel <n> |
|  cal_scale_2| 1 | channel specific calibration scale factor for channel <n>|
|  zstack_num_steps_2| 1 | number of images in z stack for channel <n>|
|  zstack_step_size_2| 100 |step size for zstack in um for channel <n> |
|  background_name_2| back_fitc.tif |fixed image to subtract for channel <n> |
|  background_exp_2| 2000 | exposure time for fixed image to be subtracted for channel <n>|
|  channel_3| cy3 |channel_<n> to be images |
|  exp_time_3| 200 |exposure time of channel <n> |
|  exp_counts_3| 1238099.6 | imager independent scaled exposure time for channel <n>|
|  stain_name_3| bkgnd | name of stain for channel <n>|
|  af_removal_round_3| -1 |channel to be used for AF removal for this stain (-1 means do not perform AF removal) |
|  cal_cps_3| 6190498 |channel specific calibration factor for channel <n> |
|  cal_scale_3| 1 |channel specific calibration scale factor for channel <n> |
|  zstack_num_steps_3| 1 | number of images in z stack for channel <n>|
|  zstack_step_size_3| 200 |step size for zstack in um for channel <n> |
|  background_name_3| back_cy3.tif | fixed image to subtract for channel <n>|
|  background_exp_3| 2000 |exposure time for fixed image to be subtracted for channel <n> |
|  channel_4| cy5 | channel_<n> to be images|
|  exp_time_4| 500 |exposure time of channel <n> |
|  exp_counts_4| 167137.6719 | imager independent scaled exposure time for channel <n>|
|  stain_name_4| bkgnd | name of stain for channel <n>|
|  af_removal_round_4| -1 |channel to be used for AF removal for this stain (-1 means do not perform AF removal) |
|  cal_cps_4| 334275.3438 | channel specific calibration factor for channel <n>|
|  cal_scale_4| 1 | channel specific calibration scale factor for channel <n>|
|  zstack_num_steps_4| 1 | number of images in z stack for channel <n>|
|  zstack_step_size_4| 500 |step size for zstack in um for channel <n> |
|  background_name_4| back_cy5.tif |fixed image to subtract for channel <n> |
|  background_exp_4| 2000 |exposure time for fixed image to be subtracted for channel <n> |
|  rotation_determined| TRUE | Has relative rotation of slide versus the auto-align round been determined|

The following metadata files reside in the parent study folder.

|**File** |  **Definition**| **Example** | 
|--|--|--|
|Slide_list.txt|A list of slides used in the study.|Such as: S20030077, S20030078, S20030079, S20030080, S20030081|
|Channel_list.txt|A list of original image paths. |Such as: RegisteredImages/S002/S002_mono_dapi_reg_pyr16_region_,DAPI_INIT AFRemoved/AE1_AFRemoved_pyr16_region_,AE1|

Antibody Metadata: Each TMC will provide:
- an antibody_metadata.tsv for antibody info AND 
- a file listing each antibody name, respective cycle and channel. 

This metadata file will then inform later processes at the HIVE and be used for labeling. Further, we aim to curate the final antibody list with expert interpretation of redundant names to make antibodies and markers a searchable criteria within the HuBMAP database. (Section 6 below)

## HuBMAP Cell DIVE Raw File Structure:
The general structure of the level 0 (raw) data produced by the GE Research Cell DIVE software is shown in the image below. 

![](https://lh6.googleusercontent.com/dYC1TIRe8vDuJULaJAjNAcEYbxphXmz-mtDBx2f6hvijz-sz2OzQHnsdojuWEnEtO0sYYJwGUVlTTgGEAH5QeFzILe9oKLCztGA60mAn8UIE2pax3bcYh4tCJAKT3EMBwImGuU4)

Segmentation files are included among the processed data contributed by the TMC’s and can be found in the following locations: 
|**Type of Segmentation/Description** |  **Descriptor (the name should contain the following)**| **Location** | 
|--|--|--|
|Nuclei segmentation from dapi images|Dapi_Slidexx_regionxx_nucseg.tif|Seg_and_quant_results/segmentation|

## Cell DIVE Processing by the HIVE:
The HIVE data processing pipeline documentation are to be determined as of 12/18/2020.

## QA/QC of processed microscopy data (state 1):
QC for the Cell DIVE process as performed by GE Research is performed on the processed microscopy data (state 1).  
 
Files submitted will be in OME format and can be checked in the following ways: 
1.         There should be a region directory for each donor under the HuBMAP_OME directory
2.         Each region should contain a number of OME TIFFS equal to the number of sections taken from the block of all donors, with each file identified by the corresponding slide ID.  The full list of all slide IDs (i.e. one section per slide) is found in the root directory in the file slide_list.txt
3.        Each OME tiff file should contain a number of channels equal to the number of markers plus two (the two additional channels being the initial and the final dapi images).  The list of channels is contained in the file channel_list.txt in the data set root directory
4.       There should be an OME TIFF file for each slide in the vHE (virtual H&E)  directory.  These vHE files consist of a whole slide image for each of the slides in the data set.  The whole slide image for each slide should contain a number of distinct sections that corresponds to the number of donors in the data set.
 
For a visual assessment, each OME-TIFF can be opened in a suitable viewer (for example QuPath).  Each channel can be inspected for focus, contrast and the presence of any foreign debris obstructing the image.  Tissue loss can be inferred by comparing the dapi_init channel to the dapi_final channel.  Stitching artifacts such as mis-aligned tiles and an apparent significant quilting pattern can be determined visually as well.
 
For each specific channel, compare marker localization to the staining pattern observed in the batch control slide. This batch control slide should represent the tissue(s) used for the original antibody characterization and staining patterns should follow correct cell type localization for the target marker.
 
To avoid the presence of stitching artifacts it is critical that the imager be initially calibrated with a standard Cell DIVE™ calibration plate.  This plate includes targets to support corrections for optical distortion, slight stage and camera mis-alignment, and illumination non-uniformity.  If significant stitching artifacts are observed, consider rerunning the automated calibration routine before the next slide study is performed.  

## For Additional Help: 
Please contact: [Chris Briggs](mailto:Christine_Briggs@hms.harvard.edu)


