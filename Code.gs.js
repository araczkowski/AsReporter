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
       images: [
          {"placeholderText": "IMAGE_1", "imageBase64": `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAGO0lEQVR42rWW+U9VRxTHD9uzQACfIqBFm6JNlYhLW6MGnuBW3MBYF9JitWlqo9YqLsi+wwNxKQqPRQHlB2WtIoILCs/iwqrIJkJUWk2tpPo3fHvm3qu3LMZXiySfzJ2ZM3O+c86ceRAAeoc/c+9Q+m5BGLXrwgheCuJbjIk5YWPKRv9ZwPS1pPUOp2ebDFpk1etQ93Ijrv8dKBDf0piYEzbCdkQFTF1J2gXhBP3lWah5vhFFj+Ygp8sJmZ2jBeJbjIk5yUbYuvvTmJESYMUhfpp0aTYq/liJo63WONBCEqkKSl/MSTZ6tvWOoL+ISPMuAix8wilFnGJpLGFxNCEgzR7lfSuQ0kjQNxCSmZSB8Jg8d6CJUPH7KnxrGAPPXbRVvhOmC7Bi5f0/5jmj/PFqGDm/tf3f4Oqzr3G8/VPE3SAk3iIkqXB/KEeabZFR5wO+lPeJ6ANTBVjogunQllwXdrgBp7qnIf2eA461OiC/ayoqH69HWqMLYq8T4n5juI01EmJqWUidBbdS//V84QNPkQbhRGuqAFufSEJRlx8ON9kg8Sa9JoFJbbBByX0/RF0jRNcQ4o3mONExGcWPP0cRwy333cS4NJ/R7AofWcA4UwU4+saZI6/NQ5xGIlZgVE+a3TIT4Zf5+5o5CrpnIa/rEylCv9y1Fi33p6Dg/kyeJyTXWb+KgJNJAjQ25LIkmsNptEbEFUIEOwqpIoRdJHYqk1jjgP2VhPQmNxhaJyHpNkno60Ur5z/9zgQcbZiEEF43P5iwIJSeeAfTKiIye5MAs3nbaLJ4zSLL3XHlz3WofhYocfHpemQ1umPPWcLecwy3Qb8SjjV+jKhaToWac25Fuqxw5oEn78EX93kgjC82IrtBB78UjbiQqeKeDRHgsZYcRckVdq1E1ZPV/Ki4Ir1ttER254dcDf4o6l6GuCtjUfZwuRAmHDCBOPtwBQ7VO0vRiauxwoW+ABT2eMHQNk66wFkdTih95IVLTwLgn6yBVxCtkSOhCrD0DqGKyHPTeeFcuc7rVZIUSnu+RGXfWhQ8mIGMNgdmtGilflXfBhgap+JkqycMdyciUU6LCq/PaZ8Eww0f8PvSL5elKsBO3NSyHn8kc/4SRJ3/i/g6wtEmZ5T2rsDhO9bQs8DkJkIKkyzgvhgv612OgnZPToO8JkGF+wzvVdyzUPxOKGWpCnAUAk7cmybVdZxxIDE1hDOdvjjYYMulONwjpJbomY6liKwWFTI86U2uWJ1io1SFKsBpYaQoGVtEXSVEVQ9EVELu3S9eX7T4oSgXULYLq+I1l4YSeZlt+DDsa6iARVGqIW8wgJBKwsEbzogWp3gzPC/b7S/nNecHEsqEXyBsP80CwunFYAGOut1UuymHDdloPxsHl6vsO0fKm/AW2EZEcFcJrxEly6W6h+GW+/I+yxMJ09dQ0OA7YOfgSl4iCjsL2alYXKZQypswIgphDAt8I+Ecrd28Zkks4fs8/i5hink9tz/ky87nbqHTRDRlcBVYMhPGz6B14mc30MCnKOSFxfIGO/h783GOTIUakcGI8RAW4XeYMGsrVc/ZRz1eMQRfdrooWgr7y2krKYyI3Bn7we+A+BvFfGTnQr5eO+nmkhh5oY/YJM4Ca+KtsCFTvIIirEyZCvel8fU8vy7eHA16C9QlmaH4J+myLWMWMfOZKYpzi2GfYkXEBGY2480sFhsUbye0HJuIAP0oLEvlcBZwhIoVOLxbuC/Gv4o3Q2u2DYwplsj9WXLuxbgpF06rhN3sbb+Glowd46gsdGN0eTsIbekTkZY+DosiOJdRMvNiOOeRhFi9Br259qg9oEGO7FzHuDKa//s/oUbZSHecRTQfG4/mNEeURHyEO/kuOLmVULTXHL35Y1Gbao1sk5wPFWCyiGwWcTNNi87zm9FzyhlZnOf2PEfUHrIFzw11broA00Vk8Kn76/ehgx3fytCi5choZA7jfGQFqCLcDELA7b1oy3VEW54TbifYIUsOvZvq/P0IkJ7tzG1yBNqFgHwWkGjPuVff9/cuQOT9ZXMouguc0VXggka9A3J2vl8BmtwgwiuOszMhIpPJ2kGS8xO7xJzKSF9CWyW/HsxnymVbPAidMueh2NqOaAQYLeNkIlpTI/APro4kS6kAbKwAAAAASUVORK5CYII=`, "imageWidth": 80}
        ],
       tables:{
          0: [
            ['1:1', '1:2', '1:3', '1:4'],
            ['2:1', '2:2', '2:3', '2:4']
          ],
          1: [['❤️', '☠️'], ['👍', '👏']]
       }
    };

// doPost function is used to handle the POST request from the client.
function doPost(e) {
  console.log('doPost: ' + e);
  try {
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

  } catch (err) {
    // TODO (developer) - Handle exception
    console.log('Failed with error %s', err.message);
  }
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

// replace the text placeholder with the image blob
function replaceTextToImage(body, searchText, imageBase64, width) {
    let decodedImage = Utilities.base64Decode(imageBase64);
    let blob = Utilities.newBlob(decodedImage, MimeType.JPEG, "nameOfImage");

    let next = body.findText(searchText);
    if (!next) return;

    // replace the placholder with image
    var r = next.getElement();
    r.asText().setText("");
    var img = r.getParent().asParagraph().insertInlineImage(0, blob);
    if (width && typeof width == "number") {
          var w = img.getWidth();
          var h = img.getHeight();
          img.setWidth(width);
          img.setHeight(width * h / w);
    }  
    return next;  
  };


function renderReportFile(reportData, templateFile) {
  // gate template body
  let TemplatesFolder = getDriveFolderByName(TEMPLATES_FOLDER_NAME);
  const newTemplateFile = templateFile.makeCopy(TemplatesFolder);
  const  OpenDoc = DocumentApp.openById(newTemplateFile.getId());

  // 1. replace the placeholders with the data
  const body = OpenDoc.getBody();
  Object.keys(reportData.placeholders).forEach(function(key) {
    body.replaceText("{"+ key +"}", reportData.placeholders[key]);
  })

  // 2. replace table with data
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

  // 3. replace the image text placeholder with the image blob
  if (reportData.images) {
    for (let i = 0; i < reportData.images.length; i++) {
      let image = reportData.images[i];
      do {
        var next = replaceTextToImage(body, image.placeholderText, image.imageBase64, image.imageWidth);
      } while (next);
      
    }
  }

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
