// Description: Google Apps Script code for Google Report Server
// This code is used to generate a report based on the template and data provided by the client.

// global variables
const TEMPLATES_FOLDER_NAME = 'APEX Google Report Server';
let fileType = "application/pdf";
let fileName = "filename.pdf";

// doPost function is used to handle the POST request from the client.
function doPost(e) {
  // we have here the data from the client in POST body
  let dataBody= JSON.parse(e.postData.contents);
  let templateName = dataBody.template;
  let reportData = dataBody.data;

  // transform data into report
  let templateFile = getDriveFileByName(templateName);
  let reportEncoded = renderReportFile(reportData, templateFile);

  // return report data to the client
  return ContentService.createTextOutput(reportEncoded);
}

// doGet function is used to handle the GET request from the client.
function doGet(e) {
  // we have a call from the client as GET method
  // return info about app and about the call via POST method
  return ContentService.createTextOutput('Call me via POST!');
}

// get the template file by neame - we are taking the last one - use unic name on drive to avoid this
function getDriveFileByName(fileName) {
    let files = DriveApp.getFilesByName(fileName);
  let fileId = '';
  while (files.hasNext()) {
    let file = files.next();
    fileId = file.getId();
  }
  return DriveApp.getFileById(fileId);
};

// get the template folder by neame - we are taking the last one - use unic name on drive to avoid this
function getDriveFolderByName(folderName) {
  let folders = DriveApp.getFoldersByName(folderName);
  let folderId;
  while (folders.hasNext()) {
    let folder = folders.next();
    folderId = folder.getId();
  }
  return DriveApp.getFolderById(folderId);
};

function renderReportFile(reportData, templateFile) {
  // gate template body
  let TemplatesFolder = getDriveFolderByName(TEMPLATES_FOLDER_NAME);
  const newTemplateFile = templateFile.makeCopy(TemplatesFolder);
  const  OpenDoc = DocumentApp.openById(newTempFile.getId());

  // replace the placeholders with the data
  const body = OpenDoc.getBody();
  body.replaceText("{AisGateId}", reportData.AisGateId);

  // save the file and return the encoded content
  OpenDoc.saveAndClose();
  const BLOBPDF = newTemplateFile.getAs(fileType);
  TemplatesFolder.createFile(BLOBPDF).setName(fileName);
  TemplatesFolder.removeFile(newTemplateFile);

  // const content = OpenDoc.getBlob().getBytes();
  const content = BLOBPDF.getBytes();
  const encodedContent = Utilities.base64Encode(content);
  return encodedContent;

};
