# ASReporter - Application Script Reporter

Application Script Reporter is a business applications that produce Office documents and reports beased on templates and JSON data. ASReporter is a Web app writen in Google Apps Script, it enabling any web application to generate your Office (Word, Excel, PowerPoint), HTML, Text and PDF-documents in no time and effort - ASReporter make printing, reporting and exporting your data fast and easy.

## Architecture overview

![diagram](images/ASReporter.png?raw=true "ASReporter diagram")

## Installation and integration with your system - step by step 

### Create Apps Script Web App in Google Workspace

#### 1. Go to -> https://script.google.com/home

![picture1](images/1.png?raw=true "Apps Script")

#### 2. Click button "New project" to create a new project

![picture1](images/2.png?raw=true "Apps Script")

you can name it -> ``ASReporter Office Print Server``

#### 3. Paste the code from file ``Code.gs.js`` to ``Code.gs``

#### 4. Deploy Web app

### Create report templates folder in Google Drive

#### 1. Go to this URL -> ``https://drive.google.com/``

#### 2. Upload folder with files from this repo ``ASReporter Files``

### Call script from browser

#### 1. GET the info about Web app

#### 2. Use ``BrowserAppCode.js`` to POST report rendering and download

#### 3. Use ``ApexAppCode.js`` in Oracle APEX to POST report rendering and download from Oracle APEX