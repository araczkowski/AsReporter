# ASReporter - Application Script Reporter

Application Script Reporter is a business applications that produce Office documents and reports beased on templates and JSON data. ASReporter is a Web app writen in Google Apps Script, it enabling any web application to generate your Office (Word, Excel, PowerPoint), HTML, Text and PDF-documents in no time and effort - ASReporter make printing, reporting and exporting your data fast and easy.

## Architecture overview

![diagram](images/ASReporter.png?raw=true "ASReporter diagram")

## Installation and integration with your system - step by step 

### Create Apps Script Web App in Google Workspace

#### 1. Go to -> https://script.google.com/home

![picture1](images/1.png?raw=true "Apps Script")

#### 2. Click button "New project" to create a new project

![picture2](images/2.png?raw=true "Apps Script 2"):
you can name it -> ``ASReporter Office Print Server``

#### 3. Add Apps script code

Copy and Paste the code from file in this repo: [Code.gs.js](Code.gs.js) to the ``Code.gs`` file in Apps script:
![picture3](images/3.png?raw=true "Apps Script 3")

#### 4. Deploy Web app

Click a button ``Deploy`` -> ``New deployment`` to deploy the project:
![picture4](images/4.png?raw=true "Apps Script 4")

as a deployment type choice ``Web app``:
![picture5](images/5.png?raw=true "Apps Script 5")

you can add a description and you need to change the ``Who has access`` parameter to ``Anyone``
after this click the ``Deploy`` button:
![picture6](images/6.png?raw=true "Apps Script 6")

if you are doing this for the first time you need to ``Authorize access``:
![picture7](images/7.png?raw=true "Apps Script 7")

and allow ASReporter to manage Google Drive files:
![picture8](images/8.png?raw=true "Apps Script 8")


#### 4. Test Web app

After the deployment you can test your app - just copy the app URL:
![picture9](images/9.png?raw=true "Apps Script 9")

 and paste it to the browser
![picture10](images/9.png?raw=true "Apps Script 10")


### Create report templates folder in Google Drive

#### 1. Go to this URL -> ``https://drive.google.com/``

#### 2. Upload folder with files from this repo ``ASReporter Files``

### Call script from browser

#### 1. GET the info about Web app

#### 2. Use ``BrowserAppCode.js`` to POST report rendering and download

#### 3. Use ``ApexAppCode.js`` in Oracle APEX to POST report rendering and download from Oracle APEX