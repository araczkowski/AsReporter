// Copyright © 2024 SVIETE Andrzej Raczkowski
// Description: Google Apps Script code for ASReporter - Application Script Reporter
// This app is used to generate reports based on the templates and data in JSON format

// test variables used in debug mode
const TEMPLATES_FOLDER_NAME = 'ASReporter Templates Files';
let fileType = "application/pdf";
let fileName = "filename.pdf";
let templateName = "Demo report template";
let reportData = {
       placeholders:{
          Name:"Andrzej 😎",
          TemplatePlaceholder1:"Value from JSON",
          DYN_COL_2: "Description"
       },
       tables:{
          0: [
            ['1:1', '1:2', '1:3', '1:4'],
            ['2:1', '2:2', '2:3', '2:4']
          ],
          1: [['❤️', '☠️'], ['👍', '👏']]
       }
    };

// APEX case
// reportData = [
//       {
//          placeholders:[
//             {
//                "Name":"APEX_PUBLIC_USER"
//             }
//          ]
//       }
//    ];

// doPost function is used to handle the POST request from the client.
function doPost(e) {
  // we have here the data from the client in POST body
  if (e) {
    let dataBody= JSON.parse(e.postData.contents);
    templateName = dataBody.template;
    reportData = dataBody.data;
  }
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
            <h2 class="h3 mb-3 font-weight-normal"><a href="https://github.com/araczkowski/ASReporter" target="_blank">Github AsReporter Project</a></h3>
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
  const  OpenDoc = DocumentApp.openById(newTemplateFile.getId());

  // replace the placeholders with the data
  const body = OpenDoc.getBody();

  // simple way
  if (reportData.constructor === ({}).constructor) {
    Object.keys(reportData.placeholders).forEach(function(key) {
      body.replaceText("{"+ key +"}", reportData.placeholders[key]);
    })
  }

  // APEX_JSON way
  if (reportData.constructor === [].constructor) {
    Object.keys(reportData[0].placeholders[0]).forEach(function(key) {
      body.replaceText("{"+ key +"}", reportData[0].placeholders[0][key]);
    })
  }

  // replace table with data
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  const tables = body.getTables();
  let tableIdx = 0;
  tables.forEach(table => {
    table.removeRow(1);

    for (let r = 0; r < reportData.tables[tableIdx].length; r++) {
      let tr = table.appendTableRow();
      for (let c = 0; c < reportData.tables[tableIdx][r].length; c++) {
        let td = tr.appendTableCell(reportData.tables[tableIdx][r][c]);
        td.getChild(0).asParagraph().setAttributes(cellStyle);
      }
    }

    tableIdx = tableIdx+1;
  });

  // save the file and return the encoded content
  OpenDoc.saveAndClose();
  const BLOBPDF = newTemplateFile.getAs(fileType);
  // comment this to not strore pdf in Google Drive
  TemplatesFolder.createFile(BLOBPDF).setName(fileName);
  TemplatesFolder.removeFile(newTemplateFile);

  // const content = OpenDoc.getBlob().getBytes();
  const content = BLOBPDF.getBytes();
  const encodedContent = Utilities.base64Encode(content);
  return encodedContent;

};
