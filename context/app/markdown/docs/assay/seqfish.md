

# **HuBMAP seqFISH**

### **Last Updated:** 6/16/2020

## **Overview:** 
 This document describes the seqFISH assay, data files & levels, file structure, metadata fields, QA/QC thresholds, and HIVE data processing.
 
## **Description:** 
seqFISH technology allows in situ imaging of multiple mRNAs using barcoding and fluorophore-labelled barcode readout-probes. [seqFISH+](https://www.nature.com/articles/s41586-019-1049-y) is a highly-multiplexed version of seqFISH that can resolve the identities and subcellular localization of thousands of gene transcripts. This is accomplished by expanding each standard fluorescent dye to dozens of assigned pseudocolors. The strategy is to first hybridize mRNA barcode probes to each mRNA in situ. Each mRNA barcode probe has 4 barcode regions numbered I-IV, as shown in Figure 1 on the left.
![](https://lh5.googleusercontent.com/wzByYYfoyKRTdC19wPEZlXKKHtyyoTXT2RgalNzh34xtPFia6TqjLrvOhsi2u2HFtcNeHAP3hENCe0BoJPn4TMmfg0QOUw9t2PEp3I3NuBfgt39aFk6ted1Gxg9ssuTb0g9OHrc)
>Each barcode region is decoded through sequential hybridization & imaging of readout-probes, 20 per channel.  Readout-probe signals can then be assigned pseudocolors as proxies for hybridization-step-order.

*Figure 1:* Each mRNA is barcoded with a combination of 3 barcode regions, numbered I-III (region IV is used for error correction). In turn, each barcode region is decoded by hybridization of 1 of 20 possible readout barcodes per channel (203 = 8000 unique barcodes per channel) X 3 channels (24,000 unique barcodes). The complete barcode for each mRNA is deduced from the sequence of readout barcodes for regions I-III.

![](https://lh3.googleusercontent.com/oHCVhh_9ZeoqRhEcflRjARPAdtxRCs1-lC2W4X_WNX-fBFYDC0tbkL2hDrrXVvvUGc0BVF-0eaYoi4jr0XRNz_QbcrDB4UWQjSnIHQNrtxkS97ZBnKQkkfYilBaGxOFzz6CFh-s)
*Figure 2:* Pseudocolor.

Decoding a barcode region: The readout-probes are labeled with one of 3 fluorescent tags: Alexa Fluor 488, Cy3b and Alexa Fluor 647. Twenty mRNA readout-probes are designed for each barcode region for each fluorophore channel. When employing 3 fluorophore channels, a total of 60 readout-probes (mRNAs) can be screened per decoding cycle. Readout-probes are hybridized and imaged one probe at a time such that each of the 20 readout-probes can then be assigned a unique pseudocolor (Figure 2) reflecting the hybridization-step order, as shown in Figure 3 below. Pseudocolor is a proxy for hybridization-step-order, a number from 1-20.

  

![](https://lh4.googleusercontent.com/7h0kWTfDYU_4SjiBp7aXGv6rYb7Xpt1tBg3r1opra4FpZ9mPde_nMvNy8QueLyLZOwH0JiJdgRBtUX60f39U6b5K8vYP_lX30CPnEZdDKnqYUXnYE5c3-iJ27KLg4tin1ZxC99o)

*Figure 3.* Each barcode region is decoded by sequential hybridization & imaging of 20 readout-probes. The signal from each readout-probe can then be assigned a unique pseudocolor (a number from 1-20) representing hybridization-step-order.

The complete barcode for each mRNA is deduced from the sequence of pseudocolor numbers for regions I-III (region IV is an additional round used for error correction). A total of 8,000 (203) mRNA barcodes per fluorophore detection channel allows a grand total of 24,000 unique mRNA barcodes to be interrogated. The composite images reveal both the identities and subcellular localization of up to 24,000 mRNA molecules.

## **Definitions:** 
There are a variety of terms used in this document that may not be familiar to all researchers wanting to make use of the HubMap data. The following figures illustrate several of these terms:

  

![](https://lh6.googleusercontent.com/H_6Z0jlyG_UpvbDpp9F199714CJphXnOGVArCtImsTLkHa06P2A4NmObkHKb72bPd6dZ_czctwgoe5NeV30SuXnafA6QHHywS59agDAQv-dzW_Zs9K5y9muTaoLpj97MFJuxQyE)

*Figure 4:* Slide Explorer Image is the user defined image on the slide.

The user defined slide will have multiple tiles as numbered in Figure 4. Each of these tiles are considered a single Field of View composed of a 2048 by 2048 pixel image. Tiles are selected by the experiment user manually without overlap. The coordinates of these tiles are used as the global reference to assemble all of the spots from each local tile.

A single Field of View or tile is imaged over many hybridization rounds with three channels for target probes and a final channel of DAPI.

![](https://lh3.googleusercontent.com/L-9j4_4GQucGiyvsyKVNJqxVsB1DreP2w-pTU1F-6B4mF2IbEtfXx80Rof0zjNNhV25hs2fdhDqzc1lbuz1uojfDvWOFcsf4X3k3tpdxHSgqki2DDcvVlCURT1fn-2QxlGIPYDs)![](https://lh5.googleusercontent.com/jW-1zdEs49j9TgCRIoGeI7zFu7qW6-gRviMGh7Njg0_M4AxXJh9qCpZFHP_le85Sh6sAsv03ulexL8PzPXHCz5rAje9TsWSNJv3bwQ2PaMIuyX9iF-iWpXZOzHNB8KS3kgXabq0)

*Figure 5:* Single tile images for one hybridization round, where spots are retrieved in the channels, while the DAPI channel is used for alignment.

## **HuBMAP seqFISH Data States (Levels):**
The HuBMAP project provides data levels for each seqFISH experiment.
|**Data State** |  **Description**| **Example File Type** | 
|--|--|--|
|  0 | Raw | TIFF
| 1 |  Processed | TIFF
| 2 |  Segmentation:  |  TIFF
| 3 |  Annotation (Cells and Structures): Interpretation  |  TIFF, ZARR, CSV

## **HuBMAP Metadata:** 
All HuBMAP seqFISH data will have searchable metadata fields. The metadata.tsv can be downloaded from this [Github link](https://github.com/hubmapconsortium/ingest-validation-tools/tree/master/docs/seqfish) which also contains field descriptions, and required formats.

## **Associated JSON Files:**
In addition, all HuBMAP seq data will have an associated json file which may contain the following additional metadata fields:

|**Field** |  **Definition**| **Example**
|--|--|--|
|  "version"| Software version used| Micro-Manager-1.4
|  "name"| Descriptive name assigned to the data| W101-Heart-RVLVLA
|  "dateProcessed"| Date of experiment| 2019-09-18T07:17:53
|  "path"| Local file path in experimenter's lab indicating where the raw (state 0) data produced was saved by the instrument. Generally not important.| “D:/DATA/HuBMAP/20190918_W101-Heart-RVLVLA
|  "outputPath"| Local file path in experimenter's lab indicating where the processed (state > 0) data was saved. Generally this field is not important.| “D:/DATA/HuBMAP/20190918_W101-Heart-RVLVLA”
|  "objectiveType"| Brand/specification of the microscope objective lens being used| oil
|  "magnification"| Microscope objective lens magnification (e.g. 20x)| 63
|  "aperture"| Numerical aperture of the lens| 1.4
|  "xyResolution"| Spatial resolution (minimum distance that can be resolved by the microscope), typically in nanometers.| 110
|  "zPitch"| Distance between Z planes (typically µm)| 0.75
|  "wavelengths"| Excitation wavelength in nanometers (energy of light used for given channel). One value per channel.| [ 635, 561, 488, 405]
|  "bitness"| Bit depth of each channel| 16
|  "numCycles"| How many fluorescent stain-strip cycles are included in the run| 9
|  "numTiles"| Number x direction tiles times number of y direction tiles (area in number of tiles to be collected)| 25
|  "numZPlanes"| Number x direction tiles times number of y direction tiles (area in number of tiles to be collected)| 20
|  "numOriginalPlanes"| How many user-defined z-planes were entered in the Akoya software. Generally the same as numZPlanes.| 20
|  "numChannels"| Number of fluorescent channels imaged during each cycle.| 4
|  "total_num_tiles"| Total number of tiles captured| 5
|  "tileWidth"| Tile horizontal size (field of view)| 2048
|  "tileHeight"| Tile vertical size (field of view)| 2048
|  "tileOverlapX"| Percent of overlap between tiles in x dimension. (e.g., 30% overlap)| 0
|  "tileOverlapY"| Percent of overlap between tiles in y dimension. (e.g., 30% overlap)| 0
|  "tilingMode"| Pattern of stage movement of microscope while acquiring tiles.| snakeRows
|  "backgroundSubtractionMode"| Method used to subtract the background fluorescence from stained images| auto
|  "driftCompReferenceCycle"| Cycle used for drift correction in imaging. Some datasets show this as "referenceCycle"| 1
|  "driftCompReferenceChannel"| Channel used for drift correction in imaging. Some datasets show this as "referenceChannel".| 1
|  "bestFocusReferenceCycle"| **Cycle used for z-focus selection in imaging| 1
|  "bestFocusReferenceChannel"| Channel used for z-focus selection in imagingIntensity| Detector Counts| 1
|  "numSubTiles"| Number of tiles within a tile (generally one for HuBMAP data)| 1
|  "focusingOffset"| User defined linear offset of the computationally determined focus z-plane.| 0
|  "useBackgroundSubtraction"| Was computational background subtraction processing used| true
|  "useDeconvolution"| Was computational deconvolution processing used| true
|  "useShadingCorrection"| Was shading correction used| true
|  "use3dDriftCompensation"| Was 3D (z-plane) drift compensation used| true
|  "useBleachMinimizingCrop"| Was bleach minimizing crop used| false
|  "useBlindDeconvolution"| Was blind deconvolution used| false
|  "useDiagnosticMode"| Was diagnostic mode used| true
|  "multipointMode"| Was multipoint microscope focus mode used| false
|  "HandEstain"| Was H and E stain mode used| false
|  "channelNames"| The microscope-defined names of the fluorophore| channelNamesArray[ ]
|  "channelNamesArray"| List of stains, See right.| [ "635", "561," "488," "405" ]
|  "exposureTimes"| Length of time (usually in milliseconds) the tile is exposed to excitation light.| exposureTimesArray [ ]
|  "exposureTimesArray"| Exposure time for each channel within each cycle| [ [ "Cycle", "CH1", "CH2", "CH3", "CH4" ], [ "1", "1000", "1000", "1000", "700" ], ["2", "1000", "1000", "1000", "700" ], [ "3", "1000", "1000", "1000", "700"] ]
|  "numerical_aperture"| The objective numerical aperture| 0.75
|  "z_pitch"| Spacing between each z-plane in microns| 0.75
|  "cycle_lower_limit"| Lowest cycle recorded|  1
|  "cycle_upper_limit"| Highest cycle recorded|9
|  "num_z_planes"| Number of Z-planes| 20
|  "tile_width"| Number of pixels in the X-dimension| 2048
|  "tile_height"| Number of pixels in the Y-dimension| 2048
|  "tile_overlap_X"| Pixel overlap in the X direction| 0
|  "tile_overlap_Y"| Pixel overlap in the Y direction| 0
|  "dimension_order"| Order of dimensions for OME-TIFF| "XYCZT"
|  "global_tile_height"| Number of pixels in the global X-dimension| 32
|  "global_tile_width"| Number of pixels in the global Y-dimension| 32
|  "offsets"| Alignment offsets for aligning to the reference cycle.| [ [ “FOV”, "CYCLE", "X", "Y", "Z" ], [ “0", “0”, "2.3423", "-0.3234", "1.3234"], ["0", “1”, "2.093", "-0.4554", "1.233" ], [ "0", “2”, "2.434", "-0.0432", "1.342"] ]
|  "chromatic_aberration_offsets"| Offsets to compensate for chromatic aberration shifts in each channel| [ [ “CH", "X", "Y", "Z" ], [ “1", "1.2323", "-0.5433", "1.2122"], [“2”, "1.032", "-0.7454", "0.742" ], [ "3", "2.322", "-0342", "2.334"] ]


## **HuBMAP seqFISH Raw File Structure**
1.  # The general structure of the stage 0 (raw) data produced by seqFISH shown in the image below.
![](https://lh6.googleusercontent.com/vTtZ9ef0WRV0jLuWmU7RjglIIMZPPvGcze9lnMQbdd-G7wdbxyvqNhRq7DfciuZ2qmslwVbSBqOVtMr8VlgiU4JQaFr5_2Lw4oKTtlcbAuO5_1mSVMeHLrrXGNKO_OAlqfg3upU)

2.  Segmentation files in the processed data contributed by the TMC’s can be found in the following locations:  
      
    Cell segmentation results can be found in the location mentioned below. You can see a csv file generated for all the Field of Views named as centroids.csv, containing the local centroids for each of the cells. Coordinates for each tile are stored in the fov-info.csv, which has columns for fov, x, y, boundary box coordinates. The masks per tile can be found as .tiffs which contain the integer for each local field of view.
    
3.  Each field of view will consist of one TIFF for each hybridization cycle, each with 4 channels (647, 594, Cy3b, 488), where the first 3 channels are the fluorescent channels for identifying RNAs from the target probes, and the last channel (DAPI) is used for registration and alignment.

|**Type of Segmentation/Description** |  **Descriptor (the name should contain the following)**| **Location** | 
|--|--|--|
|  Cell segmentation mask | *segmentation_mask| Example: [https://app.globus.org/file-manager?origin_id=28bbb03c-a87d-4dd7-a661-7ea2fb6ea631&origin_path=%2FStanford%20TMC%2F26191c2719339be0c3fa6dc8a7ba3550%2F20190514_HUBMAP_CL1_processed%2F](https://app.globus.org/file-manager?origin_id=28bbb03c-a87d-4dd7-a661-7ea2fb6ea631&origin_path=%2FStanford%20TMC%2F26191c2719339be0c3fa6dc8a7ba3550%2F20190514_HUBMAP_CL1_processed%2F)
|  count_matrix | *count_matrix| Example

## **HuBMAP QA/QC of raw (state0) data files:**
1.  Files submitted by the TMC’s will be validated in the following ways:
   
- Checked for zero length files
    
- The number of (raw) folders should be equal to the number of cycles plus one (hyb 1 repeat).
    
- The number of image files (TIFF) should be equal to the number of cycles * number of tiles (field of views).
    
If files submitted fail this criteria, the recommended action by the HIVE is to reject the dataset.

2.  A cycle for assessing background (“final_mRNA_background”) should be included in every seqFISH experiment. At a minimum, the final_mRNA_background folder should include the same number of Field of Views. If files submitted fail this criteria for the seqFISH dataset, the recommended action by the HIVE is to reject the dataset.
    
3.  Alignment can be visually inspected for each Field of View in order to validate the accuracy across all hybridization cycles.
    
4.  Calculate signal retention from the first hybridization cycle to the last hybridization cycle. The last cycle will always be used as a repeat of the first cycle. It is recommended that the signal retention for spots stay above 50%.

## **seqFISH Data Processing by the HIVE:**
The HuBMAP program is developing a standardized open-source pipeline for seqFISH based assay in the coming year

## **Terms defined in this document**
|**Term** |  **Definition**
|--|--|
|  Intensity| Detector Counts| 
|  Signal| Intensity produced by fluorescence, both endogenous and introduced| 
|  Noise| Intensity not produced by light but electronic fluctuations or electronic background.| 
|  Stitching| Image stitching is the process of combining multiple images (tiles) with overlapping fields of view to produce a single, large image.| 
|  Alignment/Registration| Image registration is the process of transforming different images into one coordinate system. Registration of all channels in each cycle is performed.| 
|  Deconvolution| Deconvolution refers to reversing the optical distortion that takes place in an optical microscope to sharpen images/ improve definition. Practically, deconvolution can also sharpen images that suffer from fast motion or jiggles during capturing.| 
|  Channels| Name of the fluorescence excitation wavelengths used. May be expressed as a fluorophore name (e.g. DAPI, GFP, DsRED, Cy5), wavelength (e.g. 488, 540, 750), or color (e.g. green, red, blue).| 
|  Cycles| A process of adding a round of antibodies, imaging the bound antibodies, stripping the antibodies, and washing away the released antibody.| 
|  Regions| User defined imaging area.| 
|  seqFISH| Sequential Fluorescence In-Situ Hybridization.|
|  Autofluorescence/Background| Endogenous fluorescence signal.| 
|  Fluorescence| Light produced by a fluorophore that is bound to an antibody tag.| 
|  Z-stack| A series of images produced at different stage heights or z positions.| 
|  X plane| Plane that determines width| 
|  Y plane| Plane that determines height| 
|  Z plane| Plane that determines depth| 
|  Pitch| Distance between pixels| 
|  Tile| Rectangular field-of-view (Figure 1).| 
| Pixel| How close two objects can be and still be differentiated within an image. This is generally dependent upon the diffraction limit of light and the microscope objective.| 
| Field of View| Angle through which light can reach the detector. Available imaging area without stage movement.| 
| Background Subtraction| Subtraction of autofluorescence intensity from total intensity.| 

## **For Additional Help:** 
Please contact:[Nico Pierson](mailto:nicogpt@caltech.edu)
