function getDUAText(mapped_data_access_level) {
  if (mapped_data_access_level === 'Protected') {
    return {
      title: 'Genomic Sequence',
      appropriateUse: `You are attempting to download protected genomic sequence data accessible only to HuBMAP Members who have requested and been granted access. 
    Access to these data will be made available in dbGAP for non-consortium members. 
    By downloading HuBMAP raw or processed data and using this data alone or combined with any other information, 
    you affirm you will abide by rules set by the HuBMAP Data Sharing Policy, 
    by provisions of the Data Use Agreement signed by your institution and the NIH Genomic Data Sharing Policy; 
    including not re-identifying or contacting sample donors or their families and maintaining confidentiality of HuBMAP participant data. 
    You are not permitted to email or to transfer HuBMAP data to collaborators.`,
    };
  }

  if (mapped_data_access_level === 'Consortium') {
    return {
      title: 'Controlled',
      appropriateUse: `You are attempting to download data accessible only to HuBMAP Members. 
    By downloading HuBMAP raw or processed data and using this data alone or combined with any other information, 
    you affirm you will abide by rules set by the HuBMAP Data Sharing Policy and by provisions of the Data Use Agreement signed by your institutional signatory; 
    including not re-identifying or contacting sample donors or their families and maintaining confidentiality of HuBMAP participant data. 
    You are not permitted to email or to transfer HuBMAP data to collaborators.`,
    };
  }

  return {
    title: 'Public',
    appropriateUse: `By downloading HuBMAP raw or processed data and using this data alone or combined with any other information,
     you affirm you will abide by rules set by the HuBMAP Data Sharing Policy; 
     including not re-identifying or contacting sample donors or their families and maintaining confidentiality of HuBMAP participant data.`,
  };
}

export { getDUAText };
