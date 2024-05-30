function doGet(e) {
  // we have here the data from the client in GET paremeters
  // https://script.google.com/macros/s/.../exec?data={"AisGateId": 123}&template=TemplateAPEX1
  let reportData = {"AisGateId": 1234};
  let templateName = "TemplateAPEX1";
  if (e) {
    reportData = {"AisGateId": 1234};//JSON.parse(Utilities.base64Encode(e.parameter.data));
    templateName = e.parameter.template;
  }
  console.log(Utilities.base64EncodeWebSafe('eyJBaXNHYXRlSWQiOiJ4eHgxMjMifQ=='));
  console.log(Utilities.base64Decode('eyJBaXNHYXRlSWQiOiJ4eHgxMjMifQ=='));
  //
  // throw new Error( "reportData: " + reportData);
  //

  // transform data into report
  let templateFile = getDriveFile(templateName);
  let reportEncoded = getReportFile(reportData, templateFile);

  // return report data to the client
  return ContentService.createTextOutput(reportEncoded);
}

// get the template file by neame - we are taking the last one - use unic name on drive to avoid this
function getDriveFile(fileName) {
    let files = DriveApp.getFilesByName(fileName);
  let fileId = '';
  while (files.hasNext()) {
    let file = files.next();
    fileId = file.getId();
  }
  return DriveApp.getFileById(fileId);
};

// get the template folder by neame - we are taking the last one - use unic name on drive to avoid this
function getDriveFolder(folderName) {
  let folders = DriveApp.getFoldersByName(folderName);
  let folderId;
  while (folders.hasNext()) {
    let folder = folders.next();
    folderId = folder.getId();
  }
  return DriveApp.getFolderById(folderId);
};

function getReportFile(reportData, templateFile) {
  // gate template body
  let TEMP_Folder = getDriveFolder('APEX Google Report Server');
  const newTempFile = templateFile.makeCopy(TEMP_Folder);
  const  OpenDoc = DocumentApp.openById(newTempFile.getId());

  // gate id info
  const body = OpenDoc.getBody();
  body.replaceText("{AisGateId}", reportData.AisGateId);

  //
  OpenDoc.saveAndClose();
  const BLOBPDF = newTempFile.getAs(MimeType.PDF);
  TEMP_Folder.createFile(BLOBPDF).setName(reportData.AisGateId + ".pdf");
  TEMP_Folder.removeFile(newTempFile);


  // const content = OpenDoc.getBlob().getBytes();
  const content = BLOBPDF.getBytes();
  const encodedContent = Utilities.base64Encode(content);
  return encodedContent;

};
