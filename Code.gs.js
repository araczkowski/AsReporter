// Copyright © 2024 SVIETE Andrzej Raczkowski
// Description: Google Apps Script code for AsReporter - Application Script Reporter
// This app is used to generate reports based on the templates and data in JSON format

// global variables
const TEMPLATES_FOLDER_NAME = 'AsReporter Templates Files';
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
  // Call from the client via GET method - return info about app
  let infoPage = `
    <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="description" content="">
          <meta name="author" content="SVIETE Andrzej Raczkowski">
          <title>Info page for AsReporter</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      </head>
      <body class="text-center">
          <h1 style="padding: 30px;">AsReporter</h1>
          <div class="form-signin">
            <img class="mb-4" src="https://raw.githubusercontent.com/araczkowski/AsReporter/main/images/about.webp" alt="SVIETE" style="max-width:80%;">
            <h1 class="h3 mb-3 font-weight-normal">Please find the instruction and source code on Github:</h1>
            <h2 class="h3 mb-3 font-weight-normal"><a href="https://github.com/araczkowski/AsReporter" target="_blank">Github AsReporter Project</a></h3>
            <p class="mt-5 mb-3 text-muted"> © 2024 SVIETE Andrzej Raczkowski</p>
          </div>
      </body>
    </html>`;
  return HtmlService.createHtmlOutput(infoPage);
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
